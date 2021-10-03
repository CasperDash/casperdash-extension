import { REQUEST } from '../actionTypes';
export default function userReducer(state = {}, action) {
	switch (action.type) {
		case REQUEST.SET_REQUEST_STATUS:
			return { ...state, isLoading: action.payload };
		default:
			return state;
	}
}
