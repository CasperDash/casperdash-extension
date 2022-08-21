import { ObservableStore } from '@metamask/obs-store';
import RPC from './RPC';
import AccountController from './Controllers/AccountController';

const appStore = new ObservableStore({});
const accountController = new AccountController(appStore);

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
	rpc.register('accountManager.getPublicKey', accountController.getPublicKey);
	rpc.register('WORKER_KEEP_ALIVE_MESSAGE', () => {});
}
