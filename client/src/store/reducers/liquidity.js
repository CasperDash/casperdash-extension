import { initialState } from '../';
import { LIQUIDITY } from '../actionTypes';

export default function liquidityReducer(
	state = initialState.liquidity,
	action
) {

	switch (action.type) {
		case LIQUIDITY.UPDATE_TOKEN_X:
			return {
				...state,
				tokenX: {...state.tokenX, ...action.payload.tokenX},
			};
		case LIQUIDITY.UPDATE_TOKEN_Y:
			return {
				...state,
				tokenY: {...state.tokenY, ...action.payload.tokenY}
			};
		case LIQUIDITY.RESET:
			return initialState.liquidity;
		default:
			return state;
	}
}
