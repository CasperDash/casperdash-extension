import { KEY_MANAGER } from '../actionTypes';
export default function userReducer(state = {}, action) {
	switch (action.type) {
		case KEY_MANAGER.UPDATE_LOCAL_STORAGE:
			return { ...state, ...action.payload };
		case KEY_MANAGER.GET_LOCAL_STORAGE:
			return { ...state, ...action.payload };
		default:
			return state;
	}
}
