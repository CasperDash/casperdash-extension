import { getLocalStorageValue } from '../../services/localStorage';
import { DEPLOY } from '../actionTypes';

export default function userReducer(state = { delegations: [] }, action) {
	switch (action.type) {
		case DEPLOY.PUSH_STAKE_TO_LOCAL_STORAGE:
			const delegations = state.delegations || [];
			return { ...state, delegations: [...delegations, action.payload] };
		case DEPLOY.GET_STAKES_FROM_LOCAL_STORAGE:
			const items = getLocalStorageValue(action.payload, 'deploys.stakes');
			return { ...state, delegations: items };
		default:
			return state;
	}
}
