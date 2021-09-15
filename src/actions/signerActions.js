import { SIGNER, USERS } from '../store/actionTypes';
import { Signer } from 'casper-js-sdk';

export const updateConnectStatus = (isConnected) => {
	return (dispatch) => {
		dispatch({ type: SIGNER.UPDATE_CONNECT_STATUS, payload: { isConnected } });
	};
};

export const updateLockStatus = (isLocked) => {
	return (dispatch) => dispatch({ type: SIGNER.UPDATE_CONNECT_STATUS, payload: { isLocked } });
};

export const connectCasper = () => {
	return async (dispatch) => {
		const isConnected = await Signer.isConnected();
		if (!isConnected) {
			Signer.sendConnectionRequest();
			return;
		} else {
			try {
				const address = await Signer.getActivePublicKey();
				dispatch({ type: USERS.SET_USER_ADDRESS, payload: { address: address } });
				dispatch({ type: SIGNER.CLEAR_CONNECT_ERROR });
			} catch (error) {
				dispatch({ type: SIGNER.SET_CONNECT_ERROR, payload: { error: error.message } });
			}
		}
	};
};

export const handleUnlockSigner = ({ isUnlocked, activeKey }) => {
	return (dispatch) => {
		dispatch({ type: SIGNER.UPDATE_LOCK_STATUS, payload: { isUnlocked } });
		dispatch({ type: USERS.SET_USER_ADDRESS, payload: { publicKey: activeKey } });
	};
};

export const handleLockSigner = () => {
	return (dispatch) => {
		dispatch({ type: SIGNER.UPDATE_LOCK_STATUS, payload: { isUnlocked: false } });
	};
};
