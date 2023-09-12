import { getLocalStorageValue, getNetworkStorageKey } from '../../services/localStorage';
import { STAKE } from '../actionTypes';

export default function userReducer(state = { delegations: [] }, action) {
	switch (action.type) {
		case STAKE.PUSH_STAKE_TO_LOCAL_STORAGE: {
			const delegations = state.delegations || [];
			return { ...state, delegations: [...delegations, action.payload] };
		}
		case STAKE.GET_STAKES_FROM_LOCAL_STORAGE: {
			const items = getLocalStorageValue(
				action.payload.publicKey,
				getNetworkStorageKey('deploys.stakes', action.payload.network),
			);
			return { ...state, delegations: items };
		}
		case STAKE.UPDATE_STAKES_LOCAL_STORAGE: {
			return { ...state, delegations: action.payload };
		}
		default:
			return state;
	}
}
