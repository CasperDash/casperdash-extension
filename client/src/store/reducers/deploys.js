import { getLocalStorageValue, getNetworkStorageKey } from '../../services/localStorage';
import { DEPLOY } from '../actionTypes';

export default function deployReducer(state = { transfers: [] }, action) {
	switch (action.type) {
		case DEPLOY.PUSH_TRANSFER_TO_LOCAL_STORAGE: {
			const transfers = state.transfers || [];
			return { ...state, transfers: [...transfers, action.payload] };
		}
		case DEPLOY.GET_TRANSFERS_FROM_LOCAL_STORAGE: {
			const items = getLocalStorageValue(
				action.payload.publicKey,
				getNetworkStorageKey('deploys.transfers', action.payload.network),
			);

			return { ...state, transfers: items };
		}
		case DEPLOY.UPDATE_TRANSFER_LOCAL_STORAGE:
			return { ...state, transfers: action.payload };
		default:
			return state;
	}
}
