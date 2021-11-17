import { DEPLOY, VALIDATORS } from '../store/actionTypes';
import { setLocalStorageValue } from '../services/localStorage';

const LOCAL_STORAGE_STAKE_PATH = 'deploys.stakes';

export const pushStakeToLocalStorage = (publicKey, value) => (dispatch) => {
	setLocalStorageValue(publicKey, LOCAL_STORAGE_STAKE_PATH, value, 'push');
	dispatch({ type: DEPLOY.PUSH_STAKE_TO_LOCAL_STORAGE, payload: value });
};

export const getStakeFromLocalStorage = (publicKey) => ({
	type: DEPLOY.GET_STAKES_FROM_LOCAL_STORAGE,
	payload: publicKey,
});

export const fetchValidators = () => ({
	type: VALIDATORS.FETCH_ACTIVE_VALIDATORS,
	request: {
		url: '/validators',
	},
});
