import { Signer } from 'casper-js-sdk';
import isFunction from 'lodash-es/isFunction';
import { USERS, SIGNER, VALIDATORS } from '@cd/store/actionTypes';
import { CONNECTED_ACCOUNT_STORAGE_PATH, CONNECTION_TYPES } from '@cd/constants/settings';
import { isUsingExtension, getLocalStorageValue, clearChromeStorageLocal } from '@cd/services/localStorage';
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
// TODO: should replace by getBathUsersDetail
export const getBatchUserDetails = (publicKey) => ({
	type: USERS.FETCH_BATCH_USER_DETAILS,
	request: { url: `/user/${publicKey}` },
	meta: {
		requestKey: publicKey,
		requestsCapacity: 20,
	},
});

export const getBathUsersDetail = (publicKeys) => ({
	type: USERS.FETCH_BATH_USERS_DETAIL,
	request: { url: `/users`, method: 'POST', data: { publicKeys } },
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
		let cachedLoginOptions = {};
		if (isUsingExtension()) {
			// need to get from storage here to prevent missing user info
			const { loginOptions } = await getConnectedAccountChromeLocalStorage();
			cachedLoginOptions = {
				...loginOptions,
			};
		}
		//Cache public key and login options
		await cacheLoginInfoToLocalStorage(publicKey, { ...loginOptions, ...cachedLoginOptions });
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
	return async (dispatch) => {
		await onClearUserSW();
		await clearChromeStorageLocal();
		await dispatch(setPublicKey());
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
	return async (dispatch) => {
		const connectedAccount = await getConnectedAccountChromeLocalStorage();
		const { loginOptions: loginOptionsCache } = connectedAccount;
		const emptyPublicKey = '';

		dispatch(setPublicKey(emptyPublicKey, loginOptionsCache));
	};
};

export const onBindingAuthInfo = ({ publicKey, user }, onCompleted) => {
	// Store full User object into state
	return async (dispatch) => {
		await dispatch(
			setPublicKey(publicKey, {
				selectedWallet: user.selectedWallet,
				connectionType: user.connectionType,
			}),
		);

		if (isFunction(onCompleted)) {
			onCompleted();
		}
	};
};

export const resetAccount = () => {
	return (dispatch) => {
		dispatch({ type: USERS.RESET });
	};
};

export const getStakingRewards = (publicKey, page, limit = 20) => ({
	type: USERS.FETCH_STAKING_REWARDS,
	request: { url: `https://api.cspr.live/delegators/${publicKey}/rewards?page=${page}&limit=${limit}` },
});

export const getValidatorsDetails = () => ({
	type: VALIDATORS.FETCH_VALIDATORS_DETAIL,
	request: { url: `/validatorsDetail` },
	meta: {
		cache: true,
	},
});

export const fetchAccountDelegation = (publicKey) => ({
	type: USERS.FETCH_ACCOUNT_DELEGATION,
	request: { url: `/user/delegation/${publicKey}` },
});
