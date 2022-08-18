import { onCreateNewUser } from './AccountManagement';
import RPC from './RPC';

initialize().catch(console.error);

async function initialize() {
	await setupPopupServices();
}

async function setupPopupServices() {
	const rpc = new RPC({
		destination: 'popup',
		source: 'serviceWorker',
	});

	rpc.register('accountManager.createUser', onCreateNewUser);
}
