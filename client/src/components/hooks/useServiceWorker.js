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
	return sentMessage({ methodName: 'accountManager.getHDWallets' });
};

const addWalletAccount = async (index, description) => {
	return sentMessage({ methodName: 'accountManager.addWalletAccount', params: { index, description } });
};

const setDefaultWallet = async (index) => {
	return sentMessage({ methodName: 'accountManager.setDefaultWallet', params: { index } });
};

const onClearUserSW = async () => {
	return sentMessage({ methodName: 'accountManager.clearUser' });
};

const isUserExist = async () => {
	return sentMessage({ methodName: 'accountManager.isUserExist' });
};

const generateHDWallets = async (total = 0) => {
	return sentMessage({ methodName: 'accountManager.generateHDWallets', params: {total} });
};

const removeHDWalletsByIds = async (ids) => {
	return sentMessage({ methodName: 'accountManager.removeHDWalletsByIds', params: {
		ids
	}});
};

/**
 *
 * Signing Deploy actions
 */

const onSignPrivateKeySW = async (deployJSON) =>
	sentMessage({ methodName: 'accountManager.signPrivateKeyProcess', params: { deployJSON } });

export {
	sentMessage,
	onSignPrivateKeySW,
	generatePrivateKeypairSW,
	validateReturningUserSW,
	getCurrentUserSW,
	onClearUserSW,
	createUserServiceSW,
	getActivePublicKey,
	getUserHDWallets,
	addWalletAccount,
	setDefaultWallet,
	isUserExist,
	generateHDWallets,
	removeHDWalletsByIds
};
