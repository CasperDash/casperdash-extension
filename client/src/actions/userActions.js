import isObject from 'lodash-es/isObject';
import { Signer } from 'casper-js-sdk';
import { USERS, SIGNER } from '@cd/store/actionTypes';
import { CONNECTION_TYPES, CONNECTED_ACCOUNT_STORAGE_PATH } from '@cd/constants/settings';
import { clearChromeStorageLocal, getChromeStorageLocal, setChromeStorageLocal, getLocalStorageValue } from '@cd/services/localStorage';

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
			cacheLoginInfoToLocalStorage(publicKey, loginOptions);
			dispatch(setPublicKeyToStore(publicKey, loginOptions));
		} catch (error) {
			dispatch({ type: SIGNER.UPDATE_LOCK_STATUS, payload: { isLocked: true } });
		}
	};
};

/**
 * Experimenting with Chrome Storage API
 * Testing with low-level method, so see if there's additional works required
 * Expecting to changes only in this function. No need to change any from outside
 * @param {*} publicKey
 * @param {*} loginOptions
 */
const cacheLoginInfoToLocalStorage = (publicKey, loginOptions) => {
  console.log(`🚀 ~ cacheLoginInfoToLocalStorage:: `, publicKey, loginOptions)
  setChromeStorageLocal({ key: "publicKey", value: publicKey });
  setChromeStorageLocal({ key: "loginOptions", value: loginOptions });
};

export const getConnectedAccountChromeLocalStorage = async () => {
  return await getChromeStorageLocal(["publicKey", "loginOptions"]);
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
	return (dispatch) => {
		//Cache public key and login options
		cacheLoginInfoToLocalStorage(publicKey, loginOptions);
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
	return (dispatch) => {
		const connectedAccount = getConnectedAccountLocalStorage();

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

export const onClearPublicKey = () => {
	return async (dispatch, getState) => {
		const {
			user: { loginOptions: loginOptionsState },
		} = getState();
    const connectedAccount = await getConnectedAccountChromeLocalStorage();
		const { loginOptions: loginOptionsCache } = connectedAccount;
		const emptyPublicKey = '';
    cacheLoginInfoToLocalStorage(emptyPublicKey, loginOptionsCache);
		dispatch(setPublicKeyToStore(emptyPublicKey, loginOptionsState));
	};
};

export const onBindingAuthInfo = (publicKey, user) => {
	// Store full User object into state
	return async (dispatch) => {
		const userHashOpts = isObject(user.userHashingOptions)
			? JSON.stringify(user.userHashingOptions)
			: user.userHashingOptions;
		// Store user hash (string) into localStorage
		cacheLoginInfoToLocalStorage(publicKey, {
			userHashingOptions: userHashOpts,
			userInfo: user.userInfo,
		});
		dispatch(setPublicKeyToStore(publicKey, { userInfo: user.userInfo }));
	};
};
