import { initialState } from '../';

export default function liquidityReducer(
	state = initialState.liquidity,
	action
) {
	switch (action.type) {
		case 'UPDATE_LIQUIDITY_X':
			return {
				...state,
				liquidityX: {...state.liquidityX, ...action.payload.liquidityX},
			};
		case 'UPDATE_LIQUIDITY_Y':
			return {
				...state,
				liquidityY: {...state.liquidityY, ...action.payload.liquidityY}
			};
		case 'RESET':
			return initialState.liquidity;
		default:
			return state;
	}
}
