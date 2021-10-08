import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import { KEY_MANAGER } from '../store/actionTypes';

export const fetchKeyManagerDetails = (publicKey) => ({
	type: KEY_MANAGER.FETCH_KEY_MANAGER_DETAILS,
	request: { url: `/keyManager/${publicKey}` },
});

export const putWeightDeploy = (signedDeploy) => ({
	type: KEY_MANAGER.PUT_WEIGHT_DEPLOY,
	request: {
		method: 'POST',
		url: '/deploy',
		data: signedDeploy,
	},
});

export const deployKeyManagerContract = (signedDeploy) => ({
	type: KEY_MANAGER.DEPLOY_KEY_MANAGER_CONTRACT,
	request: {
		method: 'POST',
		url: '/deployKeyManagerContract',
		data: signedDeploy,
	},
});

export const updateKeysManagerLocalStorage = (publicKey, patch, value, action) => {
	return (dispatch) => {
		const { keysManager } = setLocalStorageValue(publicKey, patch, value, action);
		dispatch({
			type: KEY_MANAGER.UPDATE_LOCAL_STORAGE,
			payload: keysManager,
		});
	};
};

export const updateKeysManagerDeployStatus = (publicKey, path, listHash = []) => {
	return (dispatch) => {
		const deployStorageValue = getLocalStorageValue(publicKey, path);
		const updatedValue = Object.keys(deployStorageValue).reduce((out, key) => {
			out[key] = deployStorageValue[key].map((value) => {
				const deployStatus = listHash.find((h) => h.hash === value.hash);
				return { ...value, status: deployStatus ? deployStatus.status : value.status };
			});
			return out;
		}, {});
		dispatch(updateKeysManagerLocalStorage(publicKey, path, updatedValue, 'set'));
	};
};

export const getKeysManagerLocalStorage = (publicKey) => {
	return (dispatch) => {
		const item = getLocalStorageValue(publicKey, 'keysManager');
		dispatch({
			type: KEY_MANAGER.GET_LOCAL_STORAGE,
			payload: item ? item : { deploys: {} },
		});
	};
};

export const getKeysManagerPendingDeploys = (deployHash) => ({
	type: KEY_MANAGER.GET_DEPLOYS_STATUS,
	request: {
		url: '/deploysStatus',
		params: {
			deployHash,
		},
	},
});
