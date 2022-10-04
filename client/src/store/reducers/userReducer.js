import { USERS } from '../actionTypes';

const DEFAULT_STATE = {
	publicKey: '',
	accountIndex: 0,
	loginOptions: {},
};

export default function userReducer(
	state = DEFAULT_STATE,
	action,
) {
	switch (action.type) {
		case USERS.SET_USER_ADDRESS:
			return { ...state, publicKey: action.payload.publicKey, loginOptions: action.payload.loginOptions || {} };
		case USERS.SET_KEY_PATH:
			return { ...state, loginOptions: { ...state.loginOptions, keyIndex: action.payload } };
		case USERS.SET_ACCOUNT_INDEX:
			return { ...state, accountIndex: action.payload };
		case USERS.RESET:
			return { ...state, ...DEFAULT_STATE };
		default:
			return state;
	}
}
