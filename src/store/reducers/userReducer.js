import { USERS } from '../actionTypes';
export default function userReducer(
	state = {
		user: {
			address: '',
			balance: null,
			error: null,
		},
		balance: null,
		showLoginModal: false,
	},
	action,
) {
	switch (action.type) {
		case USERS.GET_ACCOUNT_BALANCE:
			return { ...state, balance: action.payload.balance };
		case USERS.SET_USER_ADDRESS:
			return { ...state, user: { ...state.user, publicAddress: action.payload.address } };
		case USERS.SET_CONNECT_ERROR:
			return { ...state, user: { ...state.user, error: action.payload.error } };
		case USERS.CLEAR_CONNECT_ERROR:
			return { ...state, user: { ...state.user, error: null } };
		default:
			return state;
	}
}
