import { USERS } from '../actionTypes';
export default function userReducer(
	state = {
		publicKey: '',
		connectionType: '',
	},
	action,
) {
	switch (action.type) {
		case USERS.SET_USER_ADDRESS:
			return { ...state, publicKey: action.payload.publicKey, connectionType: action.payload.connectionType };
		default:
			return state;
	}
}
