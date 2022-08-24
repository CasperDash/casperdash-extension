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
	rpc.register('accountManager.validateReturningUser', accountController.validateReturningUser);
	rpc.register('accountManager.generateKeypair', accountController.generateKeypair);

	rpc.register('accountManager.getPublicKey', accountController.getPublicKey);
  rpc.register('accountManager.getConnectionType', accountController.getConnectionType);
	rpc.register('accountManager.getCurrentUser', accountController.getCurrentUser);
	rpc.register('accountManager.clearUser', accountController.clearUser);
	rpc.register('WORKER_KEEP_ALIVE_MESSAGE', () => {});
}
