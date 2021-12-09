import { SETTINGS } from '../actionTypes';
export default function userReducer(
	state = {
		theme: '',
	},
	action,
) {
	switch (action.type) {
		case SETTINGS.SWITCH_THEME:
			return { ...state, theme: action.payload.theme };
		default:
			return state;
	}
}
