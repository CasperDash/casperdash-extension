import { Signer } from 'casper-js-sdk';
import { USERS, SIGNER } from '@cd/store/actionTypes';
import { CONNECTION_TYPES, CONNECTED_ACCOUNT_STORAGE_PATH } from '@cd/constants/settings';
import { setLocalStorageValue, getLocalStorageValue } from '@cd/services/localStorage';

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

const cacheLoginInfoToLocalStorage = (publicKey, loginOptions) => {
	setLocalStorageValue('account', CONNECTED_ACCOUNT_STORAGE_PATH, { publicKey, loginOptions }, 'set');
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

export const getConnectedAccountFromLocalStorage = () => {
	return (dispatch) => {
		const connectedAccount = getConnectedAccountLocalStorage();
		console.log(`🚀 ~ return ~ connectedAccount`, connectedAccount);
		/**
		 * TODO:
		 * This function has more responsibility than it should have
		 * We should dispatch connected info AFTER getting from local storage
		 * or change function name to its suitable one
		 */
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
	return (dispatch, getState) => {
		const {
			user: { loginOptions: loginOptionsState },
		} = getState();
		const connectedAccount = getConnectedAccountLocalStorage();
		const { loginOptions: loginOptionsCache } = connectedAccount;
		const emptyPublicKey = '';
		setLocalStorageValue(
			'account',
			CONNECTED_ACCOUNT_STORAGE_PATH,
			{ publicKey: emptyPublicKey, loginOptions: loginOptionsCache },
			'set',
		);
		dispatch(setPublicKeyToStore(emptyPublicKey, loginOptionsState));
	};
};

export const onSuccessCreatingWallet = (publicKey, user) => {
	// Store full User object into state
	return (dispatch) => {
		// Store user hash (string) into localStorage
		cacheLoginInfoToLocalStorage(publicKey, {
			userHashingOptions: user.userHashingOptions,
		});
		dispatch(setPublicKeyToStore(publicKey, { userInfo: user.userInfo }));
	};
};
