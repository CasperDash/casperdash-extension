import { Signer } from 'casper-js-sdk';
import { USERS, SIGNER } from '../store/actionTypes';
import { CONNECTION_TYPES, CONNECTED_ACCOUNT_STORAGE_PATH } from '../constants/settings';
import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';

/**
 * @param {string} publicKey
 * @returns
 */
export const getUserDetails = (publicKey) => ({
	type: USERS.FETCH_USER_DETAILS,
	request: { url: `/user/${publicKey}` },
});

/**
 * @param {string} publicKey
 * @returns
 */
export const getBatchUserDetails = (publicKey) => ({
	type: USERS.FETCH_BATCH_USER_DETAILS,
	request: { url: `/user/${publicKey}` },
	meta: {
		requestKey: publicKey,
		requestsCapacity: 20,
	},
});

/**
 * @returns
 */
export const updatePublicKeyFromSigner = () => {
	return async (dispatch) => {
		let publicKey;
		try {
			publicKey = await Signer.getActivePublicKey();
			dispatch(setPublicKey(publicKey, { connectionType: CONNECTION_TYPES.casperSigner }));
		} catch (error) {
			dispatch({ type: SIGNER.UPDATE_LOCK_STATUS, payload: { isLocked: true } });
		}
	};
};

const cacheLoginInfoToLocalStorage = (publicKey, loginOptions) => {
	setLocalStorageValue('account', CONNECTED_ACCOUNT_STORAGE_PATH, { publicKey, loginOptions }, 'set');
};

/**
 * @param {string} publicKey
 * @param {string} connectionType
 * @returns {object}
 */
export const setPublicKey = (publicKey, loginOptions = {}) => {
	//Cache public key and login options
	cacheLoginInfoToLocalStorage(publicKey, loginOptions);
	return {
		type: USERS.SET_USER_ADDRESS,
		payload: { publicKey, loginOptions },
	};
};

export const getConnectedAccountFromLocalStorage = () => {
	return (dispatch) => {
		const connectedAccount = getLocalStorageValue('account', CONNECTED_ACCOUNT_STORAGE_PATH);
    console.log(`🚀 ~ return ~ connectedAccount`, connectedAccount)
		if (connectedAccount && connectedAccount.publicKey) {
			dispatch(setPublicKey(connectedAccount.publicKey, connectedAccount.loginOptions));
			return connectedAccount.publicKey;
		}
		return undefined;
	};
};

export const lockAccount = () => {
	return (dispatch) => {
    /**
     * This clears all cached User hash info in localStorage
     */
		dispatch(setPublicKey());
	};
};

export const onSuccessCreatingWallet = (publicKey, user) => {
  // Store user hash (string) into localStorage
	cacheLoginInfoToLocalStorage(publicKey, {
		userHashingOptions: user.userHashingOptions,
	});

  // Store full User object into state
	return {
		type: USERS.SET_USER_ADDRESS,
		payload: {
			publicKey,
			loginOptions: {
				...user.userInfo,
			},
		},
	};
};
