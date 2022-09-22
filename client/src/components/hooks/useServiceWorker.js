let browser;
(async () => {
	if (window?.chrome?.runtime && chrome.runtime.id) {
		// Code running in a Chrome extension (content script, background page, etc.)
		browser = await import('webextension-polyfill');
	}
})();

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

const createUserServiceSW = async (password, keyphrase, encryptionType) => {
	return sentMessage({ methodName: 'accountManager.createUser', params: { password, keyphrase, encryptionType } });
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

const getCurrentUserSW = async () => {
	return sentMessage({ methodName: 'accountManager.getCurrentUser' });
};

const getUserHDWallets = async () => {
	return sentMessage({ methodName: 'accountManager.getHDWallets'});
};

const addWalletAccount = async (index, description) => {
	return sentMessage({ methodName: 'accountManager.addWalletAccount', params: { index, description }});
};

const setDefaultWallet = async (index) => {
	return sentMessage({ methodName: 'accountManager.setDefaultWallet', params: { index }});
};

const onClearUserSW = async () => {
	return sentMessage({ methodName: 'accountManager.clearUser' });
};

/**
 *
 * Signing Deploy actions
 */

const onSignPrivateKeySW = async (deployJSON) =>
	sentMessage({ methodName: 'accountManager.signPrivateKeyProcess', params: { deployJSON } });

/**
 *
 * Others
 */

const keepSWAlive = async () => {
	return sentMessage({ methodName: 'WORKER_KEEP_ALIVE_MESSAGE' });
};

export {
	sentMessage,
	onSignPrivateKeySW,
	generatePrivateKeypairSW,
	validateReturningUserSW,
	getCurrentUserSW,
	onClearUserSW,
	keepSWAlive,
	createUserServiceSW,
	getActivePublicKey,
	getUserHDWallets,
	addWalletAccount,
	setDefaultWallet
};
