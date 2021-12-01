import { SIGNER, USERS } from '../store/actionTypes';

/**
 * @param {boolean} isConnected
 * @returns {object}
 */
export const updateConnectStatus = (isConnected) => {
	return { type: SIGNER.UPDATE_CONNECT_STATUS, payload: { isConnected } };
};

/**
 * @param {boolean} isLocked
 * @returns {object}
 */
export const updateLockStatus = (isLocked) => {
	return { type: SIGNER.UPDATE_CONNECT_STATUS, payload: { isLocked } };
};

/**
 * @param {isUnlocked: boolean, activeKey: string}
 * @returns {object}
 */
export const handleUnlockSigner = ({ isUnlocked, activeKey }) => {
	return (dispatch) => {
		dispatch({ type: SIGNER.UPDATE_LOCK_STATUS, payload: { isUnlocked } });
		dispatch({ type: USERS.SET_USER_ADDRESS, payload: { publicKey: activeKey } });
	};
};

/**
 * @returns {object}
 */
export const handleLockSigner = () => {
	return { type: SIGNER.UPDATE_LOCK_STATUS, payload: { isUnlocked: false } };
};
