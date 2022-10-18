import isObject from 'lodash-es/isObject';
import { Signer } from 'casper-js-sdk';
import isFunction from 'lodash-es/isFunction';
import { USERS, SIGNER } from '@cd/store/actionTypes';
import { CONNECTED_ACCOUNT_STORAGE_PATH, CONNECTION_TYPES } from '@cd/constants/settings';
import { isUsingExtension, getLocalStorageValue } from '@cd/services/localStorage';
import { onClearUserSW } from '@cd/hooks/useServiceWorker';
import { cacheLoginInfoToLocalStorage, getConnectedAccountChromeLocalStorage } from './userActions.utils';

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
			const loginOptions = { connectionType: CONNECTION_TYPES.casperSigner };
			await cacheLoginInfoToLocalStorage(publicKey, loginOptions);
			dispatch(setPublicKeyToStore(publicKey, loginOptions));
		} catch (error) {
			dispatch({ type: SIGNER.UPDATE_LOCK_STATUS, payload: { isLocked: true } });
		}
	};
};

export const setPublicKeyToStore = (publicKey, loginOptions = {}) => {
	return {
		type: USERS.SET_USER_ADDRESS,
		payload: { publicKey, loginOptions },
	};
};
/**
 * @param {string} publicKey
 * @param {string} connectionType
 * @returns {object}
 */
export const setPublicKey = (publicKey, loginOptions = {}) => {
	return async (dispatch) => {
		//Cache public key and login options
		await cacheLoginInfoToLocalStorage(publicKey, loginOptions);
		dispatch(setPublicKeyToStore(publicKey, loginOptions));
	};
};

export const getConnectedAccountLocalStorage = () => getLocalStorageValue('account', CONNECTED_ACCOUNT_STORAGE_PATH);

/**
 * Get connected account info from local storage
 * then dispatch this info back into store
 * @returns
 */
export const initConnectedAccountFromLocalStorage = () => {
	return async (dispatch) => {
		let connectedAccount = undefined;
		const isChromeExtension = isUsingExtension();

		connectedAccount = isChromeExtension
			? await getConnectedAccountChromeLocalStorage()
			: getConnectedAccountLocalStorage();

		if (connectedAccount && connectedAccount.publicKey) {
			dispatch(setPublicKey(connectedAccount.publicKey, connectedAccount.loginOptions));
			return connectedAccount.publicKey;
		}
		return undefined;
	};
};

/**
 * Delete User data:
 * - Clears all cached User hash info in localStorage
 */
export const deleteAllUserData = () => {
	return (dispatch) => {
		onClearUserSW();
		dispatch(setPublicKey());
		dispatch(resetAccount());
	};
};

/**
 * 
 * Lock account:
 * - Delete public key data
 * - Keep loginOptions data
 */
export const lockAccount = () => {
	return async (dispatch, getState) => {
		const {
			user: { loginOptions: loginOptionsState },
		} = getState();
		const connectedAccount = await getConnectedAccountChromeLocalStorage();
		const { loginOptions: loginOptionsCache } = connectedAccount;
		const emptyPublicKey = '';
		await cacheLoginInfoToLocalStorage(emptyPublicKey, loginOptionsCache);
		dispatch(setPublicKeyToStore(emptyPublicKey, loginOptionsState));
	};
};

export const onBindingAuthInfo = ({ publicKey, user }, onCompleted) => {
	// Store full User object into state
	return async (dispatch) => {
		const userHashOpts = isObject(user.userHashingOptions)
			? JSON.stringify(user.userHashingOptions)
			: user.userHashingOptions;
		// Store user hash (string) into localStorage

		await cacheLoginInfoToLocalStorage(publicKey, {
			userHashingOptions: userHashOpts,
			userInfo: user.userInfo,
			currentWalletIndex: user.currentWalletIndex,
		});

		dispatch(
			setPublicKeyToStore(publicKey, {
				connectionType: CONNECTION_TYPES.privateKey,
			}),
		);

		if (isFunction(onCompleted)) {
			onCompleted();
		}
	};
};

export const updateAccountIndex = (accountIndex = 0) => {
	return (dispatch) => {
		dispatch({ type: USERS.SET_ACCOUNT_INDEX, payload: accountIndex });
	};
};

export const resetAccount = () => {
	return (dispatch) => {
		dispatch({ type: USERS.RESET });
	};
};