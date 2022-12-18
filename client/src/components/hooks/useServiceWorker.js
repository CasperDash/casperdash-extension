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
	const br = browser || chrome;
	const result = await br.runtime.sendMessage({ ...options, payload });
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

const getKeyphrase = async (password) => {
	return sentMessage({ methodName: 'accountManager.getKeyphrase', params: { password } });
};

const addLegacyAccount = async (name, secretKey) => {
	return sentMessage({ methodName: 'accountManager.addLegacyAccount', params: { name, secretKey } });
};

const getPrivateKey = async (password) => {
	return sentMessage({ methodName: 'accountManager.getPrivateKey', params: { password } });
};

const setPopupOpenState = async (state) => {
	return sentMessage({ methodName: 'setPopupOpenState', params: { state } });
};

const getCurrentConnectedUrl = async () => {
	return sentMessage({ methodName: 'popupManager.getCurrentSite' });
};

const addConnectedSite = async (site, publicKey) => {
	return sentMessage({ methodName: 'popupManager.addConnectedSite', params: { site, publicKey } });
};

const getConnectedSites = async () => {
	return sentMessage({ methodName: 'popupManager.getConnectedSites' });
};

const disconnectFromSite = async (origin, publicKey) => {
	return sentMessage({ methodName: 'popupManager.disconnectFromSite', params: { origin, publicKey } });
};

const closePopup = async () => {
	return sentMessage({ methodName: 'popupManager.closePopup' });
}

const approveSignDeployRequest = async () => {
	return sentMessage({ methodName: 'signingManager.approveSignDeployRequest' });
}

const parseSignDeployData = async () => {
	return sentMessage({ methodName: 'signingManager.parseDeployData' });
}

const parseMessageData = async () => {
	return sentMessage({ methodName: 'signingManager.parseMessageData' });
}

const approveSignMessageRequest = async () => {
	return sentMessage({ methodName: 'signingManager.approveSignMessageRequest' });
}
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
	browser,
	addLegacyAccount,
	getPrivateKey,
	setPopupOpenState,
	getCurrentConnectedUrl,
	addConnectedSite,
	getConnectedSites,
	disconnectFromSite,
	approveSignDeployRequest,
	parseSignDeployData,
	closePopup,
	approveSignMessageRequest,
	parseMessageData
};
