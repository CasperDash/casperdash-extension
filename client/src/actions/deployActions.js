import { DEPLOY } from '../store/actionTypes';
import { setLocalStorageValue, getLocalStorageValue, getNetworkStorageKey } from '../services/localStorage';

const LOCAL_STORAGE_TRANSFERS_PATH = 'deploys.transfers';

/**
 * Dispatch object for putting deploy object to api to deploy on chain.
 * @param {Object} signedDeploy
 * @returns dispatch object
 */
export const putDeploy = (signedDeploy) => ({
	type: DEPLOY.PUT_DEPLOY,
	request: {
		method: 'POST',
		url: '/deploy',
		data: signedDeploy,
	},
});

/**
 * Get laster block hash.
 * @returns dispatch object
 */
export const getLatestBlockHash = () => ({
	type: DEPLOY.GET_LATEST_BLOCK_HASH,
	request: {
		url: '/getLatestBlockHash',
	},
});

/**
 * Save transfer object to local storage
 * @param {string} publicKey public key
 * @param {object} value public key
 * @returns
 */
export const pushTransferToLocalStorage = (publicKey, value) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;

		setLocalStorageValue(publicKey, getNetworkStorageKey(LOCAL_STORAGE_TRANSFERS_PATH, network), value, 'push');
		dispatch({ type: DEPLOY.PUSH_TRANSFER_TO_LOCAL_STORAGE, payload: value });
	};
};

/**
 * Dispatch object to get transfer from local storage
 * @param {string} publicKey public key
 * @returns {Object}
 */
export const getTransfersFromLocalStorage = (publicKey) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;
		dispatch({
			type: DEPLOY.GET_TRANSFERS_FROM_LOCAL_STORAGE,
			payload: { publicKey, network },
		});
	};
};

/**
 * @param {string} deployHash
 * @returns {Object}
 */
export const getTransferDeploysStatus = (deployHash) => ({
	type: DEPLOY.GET_DEPLOYS_STATUS,
	request: {
		url: '/deploysStatus',
		params: {
			deployHash,
		},
	},
});

/**
 * @param {string} publicKey
 * @param {string} patch
 * @param {object} value
 * @param {string} action
 * @returns
 *
 */
export const updateTransferDeploysLocalStorage = (publicKey, patch, value, action) => {
	return (dispatch, getState) => {
		const network = getState().settings.network;
		const { deploys = {} } = setLocalStorageValue(publicKey, getNetworkStorageKey(patch, network), value, action);
		dispatch({
			type: DEPLOY.UPDATE_TRANSFER_LOCAL_STORAGE,
			payload: deploys.transfers ? deploys.transfers : [],
		});
	};
};

/**
 * @param {string} publicKey
 * @param {string} patch
 * @param {Array} listHash
 * @returns
 */
export const updateTransferDeployStatus = (publicKey, path, listHash = []) => {
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
		dispatch(updateTransferDeploysLocalStorage(publicKey, path, updatedValue, 'set'));
	};
};
