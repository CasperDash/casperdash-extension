import browser from 'webextension-polyfill';

const resultHandler = (response = {}) => {
	if (response.error) {
		throw Error(response.error);
	}
	return response.payload;
};

const options = {
	source: 'popup',
	destination: 'serviceWorker',
	type: 'casperdash-extension',
};

const sentMessage = async (payload) => {
	const result = await browser.runtime.sendMessage({ ...options, payload });
	return resultHandler(result);
};

const createUserService = async (password, keyphrase) => {
	return sentMessage({ methodName: 'accountManager.createUser', params: { password, keyphrase } });
};

const validateReturningUser = async (password) => {
	return sentMessage({ methodName: 'accountManager.validateReturningUser', params: { password } });
};

const getActivePublicKey = async () => {
	return sentMessage({ methodName: 'accountManager.getPublicKey' });
};

const getCurrentUserSW = async () => {
	return sentMessage({ methodName: 'accountManager.getCurrentUser' });
};

const onClearUserSW = async () => {
	return sentMessage({ methodName: 'accountManager.clearUser' });
};

const keepSWAlive = async () => {
	return sentMessage({ methodName: 'WORKER_KEEP_ALIVE_MESSAGE' });
};

export { validateReturningUser, getCurrentUserSW, onClearUserSW, keepSWAlive, createUserService, getActivePublicKey };
