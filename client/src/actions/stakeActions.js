import { STAKE, VALIDATORS } from '../store/actionTypes';
import { setLocalStorageValue, getLocalStorageValue, getNetworkStorageKey } from '../services/localStorage';

const LOCAL_STORAGE_STAKE_PATH = 'deploys.stakes';

export const pushStakeToLocalStorage = (publicKey, value) => (dispatch, getState) => {
	const network = getState().settings.network;
	setLocalStorageValue(publicKey, getNetworkStorageKey(LOCAL_STORAGE_STAKE_PATH, network), value, 'push');
	dispatch({ type: STAKE.PUSH_STAKE_TO_LOCAL_STORAGE, payload: value });
};

export const getStakeFromLocalStorage = (publicKey) => (dispatch, getState) => {
	const network = getState().settings.network;
	return dispatch({
		type: STAKE.GET_STAKES_FROM_LOCAL_STORAGE,
		payload: { publicKey, network },
	});
};

export const fetchValidators = (publicKey) => ({
	type: VALIDATORS.FETCH_ACTIVE_VALIDATORS,
	request: {
		url: publicKey ? `v2/validators?delegator=${publicKey}&cachedBy=block` : 'v2/validators',
	},
});

export const updateStakeDeployStatus = (publicKey, path, listHash = []) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;
		const deployStorageValue = getLocalStorageValue(publicKey, getNetworkStorageKey(path, network)) || [];
		const updatedValue = deployStorageValue.map((deploy) => {
			if (!deploy.deployHash) {
				return deploy;
			}
			const hashStatus = listHash.find(
				(item) => item.hash && item.hash.toLowerCase() === deploy.deployHash.toLowerCase(),
			);
			return { ...deploy, status: hashStatus ? hashStatus.status : deploy.status };
		});
		dispatch(updateStakeDeploysLocalStorage(publicKey, path, updatedValue, 'set'));
	};
};

export const updateStakeDeploysLocalStorage = (publicKey, patch, value, action) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;
		const { deploys = {} } = setLocalStorageValue(publicKey, getNetworkStorageKey(patch, network), value, action);
		dispatch({
			type: STAKE.UPDATE_STAKES_LOCAL_STORAGE,
			payload: deploys.stakes ? deploys.stakes : [],
		});
	};
};
