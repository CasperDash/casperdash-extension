import { SIGNER, USERS } from '../store/actionTypes';

export const updateConnectStatus = (isConnected) => {
	return (dispatch) => {
		dispatch({ type: SIGNER.UPDATE_CONNECT_STATUS, payload: { isConnected } });
	};
};

export const updateLockStatus = (isLocked) => {
	return (dispatch) => dispatch({ type: SIGNER.UPDATE_CONNECT_STATUS, payload: { isLocked } });
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
