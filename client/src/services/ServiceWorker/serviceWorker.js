import { ObservableStore } from '@metamask/obs-store';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import { AUTO_LOCK_TIMEOUT_ALARM } from '@cd/constants/alarm';
import { CONNECTION_TYPES } from '@cd/constants/settings';
import RPC from './RPC';
import AccountController from './Controllers/AccountController';
import PopupController from './Controllers/PopupController';
import SigningController from './Controllers/SigningController';
import './keepAlive';

const appStore = new ObservableStore({});
const accountController = new AccountController(appStore);
const popupController = new PopupController(accountController, appStore);
const signController = new SigningController(popupController, accountController);

function registerAlarmActions() {
	chrome.alarms.onAlarm.addListener(() => {
		chrome.alarms.getAll(async (alarms) => {
			const hasAlarm = alarms.find((alarm) => alarm.name === AUTO_LOCK_TIMEOUT_ALARM);

			if (hasAlarm) {
				const connectedAccount = await getConnectedAccountChromeLocalStorage();
				const { loginOptions: loginOptionsCache } = connectedAccount;
				// only lock if not using ledger
				if (loginOptionsCache.connectionType !== CONNECTION_TYPES.ledger) {
					await accountController.lockWallet();

					chrome.runtime.sendMessage({
						type: 'LOCK_WALLET',
					});

					chrome.alarms.clear(AUTO_LOCK_TIMEOUT_ALARM);
				}
			}
		});
	});
}

initialize().catch(console.error);

async function initialize() {
	await setupPopupServices();
	await setInjectApiPageServer();
	registerAlarmActions();
}

async function setInjectApiPageServer() {
	const rpc = new RPC({
		destination: 'injectpage',
		source: 'serviceWorker',
	});

	rpc.register('accountManager.getPublicKey', accountController.getPublicKey);
	rpc.register('accountManager.validateReturningUser', accountController.validateReturningUser);
	rpc.register('accountManager.isUserExist', accountController.isUserExist);

	rpc.register('popupManager.isConnected', popupController.isConnected);
	rpc.register('popupManager.openRequestConnect', popupController.openRequestConnect);
	rpc.register('popupManager.requestSwitchAccount', popupController.requestSwitchAccount);
	rpc.register('popupManager.disconnectFromSite', popupController.disconnectFromSite);
	rpc.register('popupManager.getConnectedSites', popupController.getConnectedSites);

	rpc.register('signingManager.signDeploy', signController.signDeploy);
	rpc.register('signingManager.getCurrentPublicKey', signController.getActivePublicKey);
	rpc.register('signingManager.signMessage', signController.signMessage);
}

async function setupPopupServices() {
	const rpc = new RPC({
		destination: 'popup',
		source: 'serviceWorker',
	});

	rpc.register('accountManager.createUser', accountController.createNewUser);
	rpc.register('accountManager.validateReturningUser', accountController.validateReturningUser);
	rpc.register('accountManager.signPrivateKeyProcess', accountController.signPrivateKeyProcess);
	rpc.register('accountManager.getEntropy', accountController.getEntropy);
	rpc.register('accountManager.getPublicKey', accountController.getPublicKey);
	rpc.register('accountManager.getWallets', accountController.getWallets);
	rpc.register('accountManager.addWalletAccount', accountController.addWalletAccount);
	rpc.register('accountManager.setSelectedWallet', accountController.setSelectedWallet);
	rpc.register('accountManager.clearUser', accountController.clearUser);
	rpc.register('accountManager.isUserExist', accountController.isUserExist);
	rpc.register('accountManager.addLegacyAccount', accountController.addLegacyAccount);
	rpc.register('accountManager.getPrivateKey', accountController.getPrivateKey);
	rpc.register('accountManager.updateAccountName', accountController.updateAccountName);

	rpc.register('popupManager.getCurrentSite', popupController.getCurrentSite);
	rpc.register('popupManager.addConnectedSite', popupController.addConnectedSite);
	rpc.register('popupManager.getConnectedSites', popupController.getConnectedSites);
	rpc.register('popupManager.removePublicKeyOnConnectedSite', popupController.removePublicKeyOnConnectedSite);
	rpc.register('popupManager.closePopup', popupController.closePopup);
	rpc.register('popupManager.cancelConnectingSite', popupController.cancelConnectingSite);
	rpc.register('popupManager.isPopupWindow', popupController.isPopupWindow);

	rpc.register('signingManager.parseDeployData', signController.parseDeployData);
	rpc.register('signingManager.parseMessageData', signController.parseMessageData);
	rpc.register('signingManager.approveSignDeployRequest', signController.approveSignDeployRequest);
	rpc.register('signingManager.approveSignMessageRequest', signController.approveSignMessageRequest);
	rpc.register('signingManager.rejectSignDeployRequest', signController.rejectSignDeployRequest);
	rpc.register('signingManager.rejectSignMessageRequest', signController.rejectSignMessageRequest);
}
