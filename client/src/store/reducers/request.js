import { REQUEST } from '../actionTypes';
export default function userReducer(state = { isLoading: [] }, action) {
	switch (action.type) {
		case REQUEST.ADD_REQUEST_LOADING_STATUS:
			return { ...state, isLoading: [...state.isLoading, action.payload] };
		case REQUEST.REMOVE_REQUEST_LOADING_STATUS:
			return { ...state, isLoading: state.isLoading.filter((at) => at !== action.payload) };
		default:
			return state;
	}
}
