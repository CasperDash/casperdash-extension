import { USERS, SIGNER } from '../store/actionTypes';
import { Signer } from 'casper-js-sdk';

export const getUserDetails = (publicKey) => ({
	type: USERS.FETCH_USER_DETAILS,
	request: { url: `/user/${publicKey}` },
});

export const getBalance = () => {
	return async (dispatch, getState) => {
		const state = getState();
		console.log(state);
		if (state.user.publicAddress) {
			dispatch({ type: USERS.GET_ACCOUNT_BALANCE, payload: { balance: 0 } });
		}
	};
};

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
