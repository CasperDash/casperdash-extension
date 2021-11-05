import { USERS } from '../actionTypes';
export default function userReducer(
	state = {
		publicKey: '',
	},
	action,
) {
	switch (action.type) {
		case USERS.SET_USER_ADDRESS:
			return { ...state, publicKey: action.payload.publicKey };
		default:
			return state;
	}
}
