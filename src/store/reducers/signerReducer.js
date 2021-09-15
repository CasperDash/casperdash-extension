import { SIGNER } from '../actionTypes';
export default function userReducer(
	state = {
		isConnected: false,
		isUnlocked: true,
		error: null,
	},
	action,
) {
	switch (action.type) {
		case SIGNER.UPDATE_CONNECT_STATUS:
			return { ...state, isConnected: action.payload.isConnected };
		case SIGNER.UPDATE_LOCK_STATUS:
			return { ...state, isUnlocked: action.payload.isUnlocked };
		case SIGNER.SET_CONNECT_ERROR:
			return { ...state, error: action.payload.error };
		case SIGNER.CLEAR_CONNECT_ERROR:
			return { ...state, error: null };
		default:
			return state;
	}
}
