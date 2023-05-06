import { SWAP } from '../actionTypes';
import { initialState } from '../';

export default function swapReducer(
	state = initialState.swap,
	action,
) {
	switch (action.type) {
		case SWAP.UPDATE_SWAP_FROM:
			return { ...state, swapFrom: {...state.swapFrom, ...action.payload.swapFrom} };
		case SWAP.UPDATE_SWAP_TO:
			return { ...state, swapTo: {...state.swapTo, ...action.payload.swapTo } };
		case SWAP.UPDATE_SETTINGS:
			return { ...state, settings: action.payload.settings };
		case SWAP.UPDATE_IS_RECEIVE_EXACT:
			return { ...state, isReceiveExact: action.payload.isReceiveExact };
		case SWAP.RESET:
			return { ...initialState.swap };
		default:
			return state;
	}
}
