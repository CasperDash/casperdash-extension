import { Signer } from 'casper-js-sdk';
import { USERS, SIGNER } from '../store/actionTypes';

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
			dispatch({ type: USERS.SET_USER_ADDRESS, payload: { publicKey: publicKey } });
		} catch (error) {
			dispatch({ type: SIGNER.UPDATE_LOCK_STATUS, payload: { isLocked: true } });
		}
	};
};

/**
 * @param {string} publicKey
 * @returns {object}
 */
export const setPublicKey = (publicKey) => {
	return {
		type: USERS.SET_USER_ADDRESS,
		payload: { publicKey },
	};
};
