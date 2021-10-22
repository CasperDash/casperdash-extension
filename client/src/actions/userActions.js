import { Signer } from 'casper-js-sdk';
import { USERS, SIGNER } from '../store/actionTypes';
import { getCryptoInstance, updateStorageWallet } from '../services/userServices';

export const getUserDetails = (publicKey) => ({
	type: USERS.FETCH_USER_DETAILS,
	request: { url: `/user/${publicKey}` },
});

export const updateCryptoInstance = (password) => ({
	type: USERS.UPDATE_CRYPTO_INSTANCE,
	payload: getCryptoInstance(password),
});

export const updateStorageWalletInfo = (value) => {
	return (dispatch, getState) => {
		const { user } = getState();
		const { cryptoInstance } = user;
		updateStorageWallet(cryptoInstance, value);
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

export const setSelectedWallet = (wallet) => {
	return (dispatch) => {
		dispatch({ type: USERS.SET_SELECTED_WALLET, payload: wallet });
	};
};
