import { NFTS } from '../actionTypes';
export default function userReducer(state = { address: [] }, action) {
	switch (action.type) {
		case NFTS.SET_LOCAL_STORAGE:
			return { ...state, address: [...new Set([...state.address, ...action.payload])] };
		case NFTS.GET_FROM_LOCAL_STORAGE:
			return { ...state, address: [...new Set([...state.address, ...action.payload])] };
		default:
			return state;
	}
}
