import { USERS } from '../actionTypes';
export default function userReducer(
	state = {
		publicKey: '',
		loginOptions: {},
	},
	action,
) {
	switch (action.type) {
		case USERS.SET_USER_ADDRESS:
			return { ...state, publicKey: action.payload.publicKey, loginOptions: action.payload.loginOptions || {} };
		case USERS.SET_KEY_PATH:
			return { ...state, loginOptions: { ...state.loginOptions, keyIndex: action.payload } };
		default:
			return state;
	}
}
