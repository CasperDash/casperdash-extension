import { STAKE, VALIDATORS } from '../store/actionTypes';
import { setLocalStorageValue } from '../services/localStorage';

const LOCAL_STORAGE_STAKE_PATH = 'deploys.stakes';

export const pushStakeToLocalStorage = (publicKey, value) => (dispatch) => {
	setLocalStorageValue(publicKey, LOCAL_STORAGE_STAKE_PATH, value, 'push');
	dispatch({ type: STAKE.PUSH_STAKE_TO_LOCAL_STORAGE, payload: value });
};

export const getStakeFromLocalStorage = (publicKey) => ({
	type: STAKE.GET_STAKES_FROM_LOCAL_STORAGE,
	payload: publicKey,
});

export const fetchValidators = () => ({
	type: VALIDATORS.FETCH_ACTIVE_VALIDATORS,
	request: {
		url: '/validators',
	},
});
