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

const getActivePublicKey = async () => {
	return sentMessage({ methodName: 'accountManager.getPublicKey' });
};

const getUserWallets = async () => {
	return sentMessage({ methodName: 'accountManager.getWallets' });
};

const addWalletAccount = async (index, description) => {
	return sentMessage({ methodName: 'accountManager.addWalletAccount', params: { index, description } });
};

const setSelectedWallet = async (uid) => {
	return sentMessage({ methodName: 'accountManager.setSelectedWallet', params: { uid } });
};

const onClearUserSW = async () => {
	return sentMessage({ methodName: 'accountManager.clearUser' });
};

const isUserExist = async () => {
	return sentMessage({ methodName: 'accountManager.isUserExist' });
};

const getKeyphrase = async () => {
	return sentMessage({ methodName: 'accountManager.getKeyphrase' });
};

const addLegacyAccount = async (name, secretKey) => {
	return sentMessage({ methodName: 'accountManager.addLegacyAccount', params: { name, secretKey } });
};

const getPrivateKey = async (password) => {
	return sentMessage({ methodName: 'accountManager.getPrivateKey', params: { password } });
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
	validateReturningUserSW,
	onClearUserSW,
	createUserServiceSW,
	getActivePublicKey,
	getUserWallets,
	addWalletAccount,
	setSelectedWallet,
	isUserExist,
	getKeyphrase,
	addLegacyAccount,
	getPrivateKey,
};
