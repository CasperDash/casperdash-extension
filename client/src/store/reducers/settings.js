import { SETTINGS } from '../actionTypes';

export default function userReducer(
	state = {
		theme: '',
		autoLockTime: 5
	},
	action,
) {
	switch (action.type) {
		case SETTINGS.SWITCH_THEME:
			return { ...state, theme: action.payload.theme };
		case SETTINGS.SET_AUTO_LOCK_TIME:
			return { ...state, autoLockTime: action.payload.autoLockTime };
		default:
			return state;
	}
}
