import { getLocalStorageValue } from '../../services/localStorage';
import { DEPLOY } from '../actionTypes';

export default function userReducer(state = { stakes: [] }, action) {
	switch (action.type) {
		case DEPLOY.PUSH_STAKE_TO_LOCAL_STORAGE:
			const stakes = state.stakes || [];
			return { ...state, stakes: [...stakes, action.payload] };
		case DEPLOY.GET_STAKES_FROM_LOCAL_STORAGE:
			const items = getLocalStorageValue(action.payload, 'deploys.stakes');
			return { ...state, stakes: items };
		// case DEPLOY.UPDATE_TRANSFER_LOCAL_STORAGE:
		// 	return { ...state, stakes: action.payload };
		default:
			return state;
	}
}
