import { getChromeStorageLocal, setChromeStorageLocal } from '@cd/services/localStorage';
import browser from 'webextension-polyfill';
import _uniq from 'lodash-es/uniq';
import _isEmpty from 'lodash-es/isEmpty';
import _get from 'lodash-es/get';
import { getLastError, updateStatusEvent } from '@cd/helpers/extension/signing';
import { isAccountCreated } from '@cd/actions/userActions.utils';

const CONNECTED_SITES = 'connectedSites';
const BLACKLIST_PROTOCOLS = ['chrome-extension:', 'chrome:'];
const POPUP_TYPE = {
	SIGN_DEPLOY: 'dappSignDeployRequest',
	CONNECT_ACCOUNT: 'dappConnect',
	SIGN_MESSAGE: 'dappSignMessageRequest',
	SWITCH_ACCOUNT: 'dappSwitchAccount',
};
const NOTIFICATION_WIDTH = 357;
const NOTIFICATION_HEIGHT = 600 + 28;

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
				id: activeInfo.tabId,
			};

			await this.onActiveKeyChanged({
				activeKey: await this.accountController.getCurrentPublicKey(),
			});
		});

		chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
			if (changeInfo.status !== 'complete') {
				return;
			}
			const url = parseTabURL(tab.url);
			if (url && !BLACKLIST_PROTOCOLS.includes(url.protocol)) {
				this.currentTab = {
					...this.currentTab,
					id: tabId,
				};
			}
		});

		this.appStore.subscribe(async (value) => {
			if (value && value.activePublicKey) {
				await this.onActiveKeyChanged({
					activeKey: value.activePublicKey,
				});
			}
		});
	}

	onActiveKeyChanged = async ({ activeKey }) => {
		const isConnected = await this.isConnected();

		return updateStatusEvent(this.currentTab.id, 'activeKeyChanged', {
			isUnlocked: true,
			isConnected: isConnected,
			activeKey: activeKey,
		});
	};

	reload() {
		browser.runtime.reload();
	}

	openRequestConnect = async ({ origin }) => {
		const isConnected = await this.isConnected({ origin });
		if (isConnected) {
			const isCreated = await isAccountCreated();
			if (!isCreated) {
				throw new Error('Your account has not been created.');
			}

			const activeKey = await this.accountController.getCurrentPublicKey();

			await updateStatusEvent(this.currentTab.id, 'connected', {
				isUnlocked: true,
				isConnected: true,
				activeKey,
			});

			return;
		}

		await this.openPopup({ url: origin, type: POPUP_TYPE.CONNECT_ACCOUNT });
	};

	openSignRequest = async ({ origin }) => {
		await this.openPopup({ url: origin, type: POPUP_TYPE.SIGN_DEPLOY });
	};

	requestSwitchAccount = async ({ origin }) => {
		await this.openPopup({ url: origin, type: POPUP_TYPE.SWITCH_ACCOUNT });
	};

	openSignMessageRequest = async ({ origin }) => {
		await this.openPopup({ url: origin, type: POPUP_TYPE.SIGN_MESSAGE });
	};

	openPopup = async ({ url, type }) => {
		const isCreated = await isAccountCreated();
		if (!isCreated) {
			throw new Error('Your account has not been created.');
		}

		if (this.popupWindow) {
			try {
				if (this.popupWindow.type === type) {
					let window = await browser.windows.get(this.popupWindow.windowId);
					if (window.id) {
						browser.windows.update(window.id, {
							focused: true,
							drawAttention: true,
						});

						return false;
					}
					return;
				}

				await this.closePopup({ windowId: this.popupWindow.windowId });

				return;
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e);
			}
		}

		let left = 0;
		let top = 0;
		try {
			const lastFocused = await this.getLastFocusedWindow();

			top = lastFocused.top;
			left = lastFocused.left + (lastFocused.width - NOTIFICATION_WIDTH);
		} catch (_) {
			const { screenX, screenY, outerWidth } = window;
			top = Math.max(screenY, 0);
			left = Math.max(screenX + (outerWidth - NOTIFICATION_WIDTH), 0);
		}

		const window = await browser.windows.getCurrent();

		const createdWindow = await browser.windows.create({
			url: `/popup.html#/${type}`,
			type: 'popup',
			height: NOTIFICATION_HEIGHT,
			width: NOTIFICATION_WIDTH,
			left,
			top,
		});

		this.currentSite = url;
		this.popupWindow = {
			windowId: createdWindow.id,
			type,
		};
	};

	closePopup = async ({ windowId } = {}) => {
		if (windowId) {
			await browser.windows.remove(windowId);
		} else {
			let currentWindow = await browser.windows.getCurrent();
			if (currentWindow.type === 'popup' && currentWindow.id) {
				await browser.windows.remove(currentWindow.id);
			}
		}

		this.popupWindow = null;
	};

	isPopupWindow = () => {
		return !!this.popupWindow;
	};

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

		return !!connectedSites[currentPublicKey].find((connectedSite) => connectedSite === this.currentSite);
	};

	getCurrentSite = () => {
		return this.currentSite;
	};

	getConnectedSites = async () => {
		const valueObj = await getChromeStorageLocal(CONNECTED_SITES);

		return _get(valueObj, CONNECTED_SITES, {});
	};

	addConnectedSite = async ({ site, publicKeys, activePublicKey, excludedPublicKeys }) => {
		// Get the current connected sites
		let connectedSites = await this.getConnectedSites();

		publicKeys.forEach((publicKey) => {
			const sites = _get(connectedSites, publicKey, []);

			// Check if the public key has any connected sites
			if (sites.length === 0) {
				// If no connected sites, add the new site to the connectedSites object
				connectedSites = {
					...connectedSites,
					[publicKey]: [site],
				};
			} else {
				// If there are already connected sites, add the new site to the array, deduplicating the sites
				connectedSites = {
					...connectedSites,
					[publicKey]: _uniq([...sites, site]),
				};
			}
		});

		if (excludedPublicKeys && excludedPublicKeys.length > 0 && connectedSites) {
			excludedPublicKeys.forEach((publicKey) => {
				if (connectedSites[publicKey]) {
					connectedSites[publicKey] = connectedSites[publicKey].filter((connectedSite) => connectedSite !== site);
				}
			});
		}

		// Save the updated connectedSites object to Chrome storage
		await setChromeStorageLocal({ key: CONNECTED_SITES, value: connectedSites });

		// Update the status event for the current tab
		await updateStatusEvent(this.currentTab.id, 'connected', {
			isUnlocked: true,
			isConnected: true,
			activeKey: activePublicKey,
		});

		// Return the updated connectedSites object
		return connectedSites;
	};

	cancelConnectingSite = async () => {
		await this.closePopup();
	};

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
		const filteredConnectedSites = connectedSites[currentPublicKey].filter(
			(connectedSite) => connectedSite !== origin,
		);
		await setChromeStorageLocal({
			key: CONNECTED_SITES,
			value: {
				...connectedSites,
				[currentPublicKey]: filteredConnectedSites,
			},
		});

		await updateStatusEvent(this.currentTab.id, 'disconnected', {
			isUnlocked: true,
			isConnected: false,
			activeKey: publicKey,
		});

		return origin;
	};

	getActiveTab() {
		return new Promise((resolve) => {
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
				if (tabs.length && tabs[0].url) {
					const url = parseTabURL(tabs[0].url);
					const properActiveTab = url && !BLACKLIST_PROTOCOLS.includes(url.protocol);
					resolve(properActiveTab ? url.hostname : null);
				}
				resolve(null);
			});
		});
	}

	getLastFocusedWindow() {
		return new Promise((resolve, reject) => {
			browser.windows.getLastFocused().then((windowObject) => {
				const error = getLastError();
				if (error) {
					return reject(error);
				}
				return resolve(windowObject);
			});
		});
	}
}

export default PopupController;
