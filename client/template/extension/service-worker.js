import { onCreateNewUser } from '../../src/services/ServiceWorker/AccountManagement';

chrome.runtime.onMessage.addListener(async (req) => {
	console.info('service-worker', req);
	const { keypharse, password } = req;
	const pk = onCreateNewUser(keypharse, password);
	return 'got message';
});
