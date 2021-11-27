import { getLocalStorageValue } from '../../services/localStorage';
import { DEPLOY } from '../actionTypes';

export default function userReducer(state = { transfers: [] }, action) {
	switch (action.type) {
		case DEPLOY.PUSH_TRANSFER_TO_LOCAL_STORAGE: {
			const transfers = state.transfers || [];
			return { ...state, transfers: [...transfers, action.payload] };
		}
		case DEPLOY.GET_TRANSFERS_FROM_LOCAL_STORAGE: {
			const items = getLocalStorageValue(action.payload, 'deploys.transfers');
			return { ...state, transfers: items };
		}
		case DEPLOY.UPDATE_TRANSFER_LOCAL_STORAGE:
			return { ...state, transfers: action.payload };
		default:
			return state;
	}
}
