let browser;
if (window?.chrome?.runtime && chrome.runtime.id) {
  // Code running in a Chrome extension (content script, background page, etc.)
  console.log(">>> chrome.", chrome.runtime.id);
  browser = await import("webextension-polyfill");
}

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

/**
 * 
 * User actions
 */

const createUserServiceSW = async (password, keyphrase) => {
	return sentMessage({ methodName: 'accountManager.createUser', params: { password, keyphrase } });
};

const validateReturningUserSW = async (password) => {
	return sentMessage({ methodName: 'accountManager.validateReturningUser', params: { password } });
};

const generatePrivateKeypairSW = async () => {
	return sentMessage({ methodName: 'accountManager.generateKeypair' });
};

const getActivePublicKey = async () => {
	return sentMessage({ methodName: 'accountManager.getPublicKey' });
};

const getConnectionTypeSW = async () => {
	return sentMessage({ methodName: 'accountManager.getConnectionType' });
};

const getCurrentUserSW = async () => {
	return sentMessage({ methodName: 'accountManager.getCurrentUser' });
};

const onClearUserSW = async () => {
	return sentMessage({ methodName: 'accountManager.clearUser' });
};

/**
 * 
 * Signing Deploy actions
 */

const onSignPrivateKeySW = async deployJSON => sentMessage({ methodName: "accountManager.signPrivateKeyProcess", params: { deployJSON }});

/**
 * 
 * Others
 */

const keepSWAlive = async () => {
	return sentMessage({ methodName: 'WORKER_KEEP_ALIVE_MESSAGE' });
};

export { onSignPrivateKeySW, getConnectionTypeSW, generatePrivateKeypairSW, validateReturningUserSW, getCurrentUserSW, onClearUserSW, keepSWAlive, createUserServiceSW, getActivePublicKey };
