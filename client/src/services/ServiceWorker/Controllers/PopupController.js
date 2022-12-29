import { getChromeStorageLocal, setChromeStorageLocal } from '@cd/services/localStorage';
import browser from 'webextension-polyfill';
import _uniq from 'lodash-es/uniq';
import _isEmpty from 'lodash-es/isEmpty'
import _get from 'lodash-es/get';
import { updateStatusEvent } from '@cd/services/ServiceWorker/utils';

const CONNECTED_SITES = 'connectedSites';

const BLACKLIST_PROTOCOLS = ['chrome-extension:', 'chrome:'];

const POPUP_TYPE = {
    SIGN_DEPLOY :  'dappSignDeployRequest',
    CONNECT_ACCOUNT: 'dappConnect',
    SIGN_MESSAGE: 'dappSignMessageRequest',
}

const parseTabURL = (url) => {
    if (url) {
      return new URL(url);
    }
    return undefined;
};

class PopupController {
    popupWindow;
    currentSite;
    currentTab;
    accountController;
    appStore;

    constructor(accountController, appStore) {
        this.accountController = accountController;
        this.appStore = appStore;

        this.currentTab = {};

        chrome.tabs.onActivated.addListener(async (activeInfo) => {
            const currentUrl = await this.getActiveTab();
            if (!currentUrl) {
                return;
            }
            
            this.currentTab = {
                ...this.currentTab,
                id: activeInfo.tabId
            };

            await this.onActiveKeyChanged({
                activeKey: await this.accountController.getCurrentPublicKey()
            });
        });

        chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            if (changeInfo.status !== 'complete') {
                return
            }
            const url = parseTabURL(tab.url);
            if (url && !BLACKLIST_PROTOCOLS.includes(url.protocol)) {
                this.currentTab = {
                    ...this.currentTab,
                    id: tabId
                };

            }
        });

        this.appStore.subscribe(async (value) => {
            if (value && value.activePublicKey) {
                await this.onActiveKeyChanged({
                    activeKey: value.activePublicKey
                }); 
            }
        });
    }

    onActiveKeyChanged = async ({activeKey}) => {
        const isConnected = await this.isConnected();

        return updateStatusEvent(this.currentTab.id, 'activeKeyChanged', {
            isUnlocked: true,
            isConnected: isConnected,
            activeKey: activeKey
        }); 
    }

    reload() {
        browser.runtime.reload();
    }

    openRequestConnect = async ({ origin }) => {
        const isConnected = await this.isConnected({ origin });
        if (isConnected) {
            const activeKey = await this.accountController.getCurrentPublicKey()

            await updateStatusEvent(this.currentTab.id, 'connected', {
                isUnlocked: true,
                isConnected: true,
                activeKey
            });

            return;
        }

        this.openPopup({ url: origin, type: POPUP_TYPE.CONNECT_ACCOUNT });
    }

    openSignRequest = async ({ origin }) => {
        this.openPopup({ url: origin, type: POPUP_TYPE.SIGN_DEPLOY });
    }

    openSignMessageRequest = async ({ origin }) => {
        this.openPopup({ url: origin, type: POPUP_TYPE.SIGN_MESSAGE });
    }

    openPopup = async ({ url, type }) => {
        if (this.popupWindow) {
            try {
                let window = await browser.windows.get(this.popupWindow.windowId);
                if (window.id) {
                    browser.windows.update(window.id, {
                        focused: true,
                        drawAttention: true
                    });

                    return false;
                }
                return this.popupWindow.windowId;
            } catch(e) {
                // eslint-disable-next-line no-console
                console.log(e);
            }
        }

        const window = await browser.windows.getCurrent();
        const xOffset = window.left ?? 0;
        const yOffset = window.top ?? 0;

        const createdWindow = await browser.windows.create({
            url: `/popup.html#/${type}`,
            type: 'popup',
            height: 720,
            width: 367,
            left: xOffset,
            top: yOffset
        });

        this.currentSite = url;
        this.popupWindow = {
            windowId: createdWindow.id,
        };

        return url;
    }

    closePopup = async ({windowId} = {}) => {
        if (windowId) {
            await browser.windows.remove(windowId);
        } else {
            let currentWindow = await browser.windows.getCurrent();
            if (currentWindow.type === 'popup' && currentWindow.id) {
                await browser.windows.remove(currentWindow.id);
            }
        }

        this.popupWindow = null;
    }

    isConnected = async ({ origin } = {}) => {
        const currentPublicKey = await this.accountController.getCurrentPublicKey();
        if (!currentPublicKey) {
            return false;
        }

        if (!this.currentSite && origin) {
            this.currentSite = origin;
        }

        const connectedSites = await this.getConnectedSites();

        if (_isEmpty(_get(connectedSites, currentPublicKey, false))) {
            return false;
        }

        return !!connectedSites[currentPublicKey].find(connectedSite => connectedSite === this.currentSite);
    }

    getCurrentSite = () => {
        return this.currentSite;
    }

    getConnectedSites = async () => {
        const valueObj = await getChromeStorageLocal(CONNECTED_SITES);

        return _get(valueObj, CONNECTED_SITES, {});
    }

    addConnectedSite = async ({ site, publicKey }) => {
        let connectedSites = await this.getConnectedSites();
        const sites = _get(connectedSites, publicKey, []);

        if (sites.length === 0) {
            connectedSites = {
                ...connectedSites,
                [publicKey]: [site]
            };
        } else {
            connectedSites = {
                ...connectedSites,
                [publicKey]: _uniq([...sites, site])
            };
        }

        await setChromeStorageLocal({ key: CONNECTED_SITES, value: connectedSites });

        await updateStatusEvent(this.currentTab.id, 'connected', {
            isUnlocked: true,
            isConnected: true,
            activeKey: publicKey
        });
        await this.closePopup();

        return connectedSites;
    }

    disconnectFromSite = async ({ origin, publicKey }) => {
        let currentPublicKey = publicKey;
        if (!publicKey) {
            currentPublicKey = await this.accountController.getCurrentPublicKey();
        }
        if (!currentPublicKey) {
            return;
        }
        const connectedSites = await this.getConnectedSites();

        if (_isEmpty(connectedSites) || _isEmpty(connectedSites[currentPublicKey])) {
            return;
        }
        const filteredConnectedSites = connectedSites[currentPublicKey].filter(connectedSite => connectedSite !== origin); 
        await setChromeStorageLocal({ key: CONNECTED_SITES, value: {
            ...connectedSites,
            [currentPublicKey]: filteredConnectedSites
        } });

        updateStatusEvent(this.currentTab.id, 'disconnected', {
            isUnlocked: true,
            isConnected: false,
            activeKey: publicKey
        })

        return origin;
    }

    getActiveTab() {
        return new Promise((resolve) => {
          chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            if (tabs.length && tabs[0].url) {
              const url = parseTabURL(tabs[0].url);
              const properActiveTab =
                url && !BLACKLIST_PROTOCOLS.includes(url.protocol);
              resolve(properActiveTab ? url.hostname : null);
            }
            resolve(null);
          });
        });
    }
}

export default PopupController;