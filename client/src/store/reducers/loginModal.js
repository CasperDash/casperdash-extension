import { LOGIN_MODAL } from '../actionTypes';

export default function loginModalReducer(
	state = {
		isOpen: false,
	},
	action,
) {
	switch (action.type) {
		case LOGIN_MODAL.SET_IS_OPEN:
			return { ...state, isOpen: action.payload.isOpen };
		default:
			return state;
	}
}
