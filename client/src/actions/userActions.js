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
 * @returns
 */
export const updatePublicKeyFromSigner = () => {
	return async (dispatch) => {
		let publicKey;
		try {
			publicKey = await Signer.getActivePublicKey();
			dispatch(setPublicKey(publicKey, CONNECTION_TYPES.casperSigner));
		} catch (error) {
			dispatch({ type: SIGNER.UPDATE_LOCK_STATUS, payload: { isLocked: true } });
		}
	};
};

/**
 * @param {string} publicKey
 * @param {string} connectionType
 * @returns {object}
 */
export const setPublicKey = (publicKey, connectionType) => {
	const accountInfo = { publicKey, connectionType };
	//Cache public key and connection type
	setLocalStorageValue('account', CONNECTED_ACCOUNT_STORAGE_PATH, accountInfo, 'set');
	return {
		type: USERS.SET_USER_ADDRESS,
		payload: accountInfo,
	};
};

export const getConnectedAccountFromLocalStorage = () => {
	return (dispatch) => {
		const connectedAccount = getLocalStorageValue('account', CONNECTED_ACCOUNT_STORAGE_PATH);
		if (connectedAccount && connectedAccount.publicKey) {
			dispatch(setPublicKey(connectedAccount.publicKey, connectedAccount.connectionType));
			return connectedAccount.publicKey;
		}
		return undefined;
	};
};

export const lockAccount = () => {
	return (dispatch) => {
		dispatch(setPublicKey());
	};
};
