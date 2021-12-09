import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';
import { KEY_MANAGER } from '../store/actionTypes';

/**
 *
 * @param {string} publicKey
 */
export const fetchKeyManagerDetails = (publicKey) => ({
	type: KEY_MANAGER.FETCH_KEY_MANAGER_DETAILS,
	request: { url: `/keyManager/${publicKey}` },
});

/**
 *
 * @param {object} signedDeploy
 */
export const putWeightDeploy = (signedDeploy) => ({
	type: KEY_MANAGER.PUT_WEIGHT_DEPLOY,
	request: {
		method: 'POST',
		url: '/deploy',
		data: signedDeploy,
	},
});

/**
 *
 * @param {object} signedDeploy
 */
export const deployKeyManagerContract = (signedDeploy) => ({
	type: KEY_MANAGER.DEPLOY_KEY_MANAGER_CONTRACT,
	request: {
		method: 'POST',
		url: '/deployKeyManagerContract',
		data: signedDeploy,
	},
});

/**
 *
 * @param {string} publicKey
 * @param {string} patch
 * @param {object} value
 * @param {string} action
 */
export const updateKeysManagerLocalStorage = (publicKey, patch, value, action) => {
	return (dispatch) => {
		const { keysManager } = setLocalStorageValue(publicKey, patch, value, action);
		dispatch({
			type: KEY_MANAGER.UPDATE_LOCAL_STORAGE,
			payload: keysManager,
		});
	};
};

/**
 *
 * @param {string} publicKey
 * @param {string} path
 * @param {Array} listHash
 */
export const updateKeysManagerDeployStatus = (publicKey, path, listHash = []) => {
	return (dispatch) => {
		const deployStorageValue = getLocalStorageValue(publicKey, path);
		const updatedValue = Object.keys(deployStorageValue).reduce((out, key) => {
			out[key] = deployStorageValue[key].map((value) => {
				const deployStatus = listHash.find((h) => h.hash.toLowerCase() === value.hash.toLowerCase());
				return { ...value, status: deployStatus ? deployStatus.status : value.status };
			});
			return out;
		}, {});
		dispatch(updateKeysManagerLocalStorage(publicKey, path, updatedValue, 'set'));
	};
};

/**
 *
 * @param {string} publicKey
 */
export const getKeysManagerLocalStorage = (publicKey) => {
	return (dispatch) => {
		const item = getLocalStorageValue(publicKey, 'keysManager');
		dispatch({
			type: KEY_MANAGER.GET_LOCAL_STORAGE,
			payload: item ? item : { deploys: {} },
		});
	};
};

/**
 *
 * @param {string} deployHash
 */
export const getKeysManagerPendingDeploys = (deployHash) => ({
	type: KEY_MANAGER.GET_DEPLOYS_STATUS,
	request: {
		url: '/deploysStatus',
		params: {
			deployHash,
		},
	},
});
