import { STAKE, VALIDATORS } from '../store/actionTypes';
import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';

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

export const updateStakeDeployStatus = (publicKey, path, listHash = []) => {
	return (dispatch) => {
		const deployStorageValue = getLocalStorageValue(publicKey, path) || [];
		const updatedValue = deployStorageValue.map((deploy) => {
			const hashStatus = listHash.find((hash) => hash.hash.toLowerCase() === deploy.deployHash.toLowerCase());
			return { ...deploy, status: hashStatus ? hashStatus.status : deploy.status };
		});
		dispatch(updateStakeDeploysLocalStorage(publicKey, path, updatedValue, 'set'));
	};
};

const updateStakeDeploysLocalStorage = (publicKey, patch, value, action) => {
	return (dispatch) => {
		const { deploys = {} } = setLocalStorageValue(publicKey, patch, value, action);
		dispatch({
			type: STAKE.UPDATE_STAKES_LOCAL_STORAGE,
			payload: deploys.stakes ? deploys.stakes : [],
		});
	};
};
