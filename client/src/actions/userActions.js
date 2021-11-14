import { Signer } from 'casper-js-sdk';
import { USERS, SIGNER } from '../store/actionTypes';

export const getUserDetails = (publicKey) => ({
	type: USERS.FETCH_USER_DETAILS,
	request: { url: `/user/${publicKey}` },
});

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

export const setPublicKey = (publicKey) => {
	return {
		type: USERS.SET_USER_ADDRESS,
		payload: { publicKey },
	};
};
