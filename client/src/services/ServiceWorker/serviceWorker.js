import { ObservableStore } from '@metamask/obs-store';
import RPC from './RPC';
import AccountController from './Controllers/AccountController';

const appStore = new ObservableStore({});
const accountController = new AccountController(appStore);

let lifeline;

keepAlive();

chrome.runtime.onConnect.addListener((port) => {
	if (port.name === 'keepAlive') {
		lifeline = port;
		setTimeout(keepAliveForced, 295e3); // 5 minutes minus 5 seconds
		port.onDisconnect.addListener(keepAliveForced);
	}
});

function keepAliveForced() {
	lifeline?.disconnect();
	lifeline = null;
	keepAlive();
}

async function keepAlive() {
	if (lifeline) return;
	for (const tab of await chrome.tabs.query({})) {
		try {
			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: () => chrome.runtime.connect({ name: 'keepAlive' }),
			});
			chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
			return;
		} catch (e) {
			console.error(e);
		}
	}
	chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(_tabId, info) {
	if (info.url && /^(file|https?):/.test(info.url)) {
		keepAlive();
	}
}

initialize().catch(console.error);

async function initialize() {
	await setupPopupServices();
}

async function setupPopupServices() {
	const rpc = new RPC({
		destination: 'popup',
		source: 'serviceWorker',
	});

	rpc.register('accountManager.createUser', accountController.createNewUser);
	rpc.register('accountManager.validateReturningUser', accountController.validateReturningUser);

	rpc.register('accountManager.generateKeypair', accountController.generateKeypair);
	rpc.register('accountManager.signPrivateKeyProcess', accountController.signPrivateKeyProcess);
	rpc.register('accountManager.getKeyphrase', accountController.getKeyphrase);

	rpc.register('accountManager.getPublicKey', accountController.getPublicKey);
	rpc.register('accountManager.getHDWallets', accountController.getHDWallets);
	rpc.register('accountManager.addWalletAccount', accountController.addWalletAccount);
	rpc.register('accountManager.setSelectedWallet', accountController.setSelectedWallet);
	rpc.register('accountManager.clearUser', accountController.clearUser);
	rpc.register('accountManager.isUserExist', accountController.isUserExist);
}
