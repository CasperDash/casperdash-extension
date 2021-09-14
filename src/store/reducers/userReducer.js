import { USERS } from '../actionTypes';
export default function userReducer(
	state = {
		user: null,
		balance: null,
		showLoginModal: false,
	},
	action,
) {
	switch (action.type) {
		case USERS.GET_ACCOUNT_BALANCE:
			return { ...state, balance: action.payload.balance };
		default:
			return state;
	}
}
