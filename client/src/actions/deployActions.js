import { DEPLOY } from '../store/actionTypes';
import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';

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
	return (dispatch) => {
		setLocalStorageValue(publicKey, LOCAL_STORAGE_TRANSFERS_PATH, value, 'push');
		dispatch({ type: DEPLOY.PUSH_TRANSFER_TO_LOCAL_STORAGE, payload: value });
	};
};

/**
 * Dispatch object to get transfer from local storage
 * @param {string} publicKey public key
 * @returns {Object}
 */
export const getTransfersFromLocalStorage = (publicKey) => ({
	type: DEPLOY.GET_TRANSFERS_FROM_LOCAL_STORAGE,
	payload: publicKey,
});

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
	return (dispatch) => {
		const { deploys = {} } = setLocalStorageValue(publicKey, patch, value, action);
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
	return (dispatch) => {
		const deployStorageValue = getLocalStorageValue(publicKey, path) || [];
		const updatedValue = deployStorageValue.map((deploy) => {
			const hashStatus = listHash.find((hash) => hash.hash.toLowerCase() === deploy.deployHash.toLowerCase());
			return { ...deploy, status: hashStatus ? hashStatus.status : deploy.status };
		});
		dispatch(updateTransferDeploysLocalStorage(publicKey, path, updatedValue, 'set'));
	};
};
