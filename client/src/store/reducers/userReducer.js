import { USERS } from '../actionTypes';
export default function userReducer(
	state = {
		publicKey: '',
		balance: null,
	},
	action,
) {
	switch (action.type) {
		case USERS.GET_ACCOUNT_BALANCE:
			return { ...state, balance: action.payload.balance };
		case USERS.SET_USER_ADDRESS:
			return { ...state, publicKey: action.payload.publicKey };
		default:
			return state;
	}
}
