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
	Signer.sendConnectionRequest();
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
