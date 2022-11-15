import { USERS } from '../actionTypes';
import { initialState } from '../index';

export default function userReducer(state = initialState.user, action) {
	switch (action.type) {
		case USERS.SET_USER_ADDRESS:
			return { ...state, publicKey: action.payload.publicKey, loginOptions: action.payload.loginOptions || {} };
		case USERS.SET_KEY_PATH:
			return { ...state, loginOptions: { ...state.loginOptions, keyIndex: action.payload } };

		case USERS.RESET:
			return { ...state, ...initialState.user };
		default:
			return state;
	}
}
