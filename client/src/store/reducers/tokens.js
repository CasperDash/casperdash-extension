import { TOKENS } from '../actionTypes';
export default function userReducer(state = { address: [] }, action) {
	switch (action.type) {
		case TOKENS.SET_LOCAL_STORAGE:
			return { ...state, address: [...new Set([...state.address, ...action.payload])] };
		case TOKENS.GET_FROM_LOCAL_STORAGE:
			return { ...state, address: [...new Set([...state.address, ...action.payload])] };
		default:
			return state;
	}
}
