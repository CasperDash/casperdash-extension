import { REQUEST } from '../actionTypes';
export default function userReducer(state = { isLoading: [] }, action) {
	switch (action.type) {
		case REQUEST.ADD_REQUEST_LOADING_STATUS:
			return { ...state, isLoading: [...state.isLoading, action.payload] };
		case REQUEST.REMOVE_REQUEST_LOADING_STATUS:
			const loadingActions = [...state.isLoading];
			const actionIndex = state.isLoading.indexOf(action.payload);
			loadingActions.splice(actionIndex, 1);
			return { ...state, isLoading: loadingActions };
		default:
			return state;
	}
}
