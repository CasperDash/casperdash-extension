import { DEPLOY } from '../store/actionTypes';
import { setLocalStorageValue, getLocalStorageValue } from '../services/localStorage';

const LOCAL_STORAGE_TRANSFERS_PATH = 'deploys.transfers';

export const putDeploy = (signedDeploy) => ({
	type: DEPLOY.PUT_DEPLOY,
	request: {
		method: 'POST',
		url: '/deploy',
		data: signedDeploy,
	},
});

export const getLatestBlockHash = () => ({
	type: DEPLOY.GET_LATEST_BLOCK_HASH,
	request: {
		url: '/getLatestBlockHash',
	},
});

export const pushTransferToLocalStorage = (publicKey, value) => {
	return (dispatch) => {
		setLocalStorageValue(publicKey, LOCAL_STORAGE_TRANSFERS_PATH, value, 'push');
		dispatch({ type: DEPLOY.PUSH_TRANSFER_TO_LOCAL_STORAGE, payload: value });
	};
};

export const getTransfersFromLocalStorage = (publicKey) => ({
	type: DEPLOY.GET_TRANSFERS_FROM_LOCAL_STORAGE,
	payload: publicKey,
});

export const getTransferDeploysStatus = (deployHash) => ({
	type: DEPLOY.GET_DEPLOYS_STATUS,
	request: {
		url: '/deploysStatus',
		params: {
			deployHash,
		},
	},
});

export const updateTransferDeploysLocalStorage = (publicKey, patch, value, action) => {
	return (dispatch) => {
		const { deploys = {} } = setLocalStorageValue(publicKey, patch, value, action);
		dispatch({
			type: DEPLOY.UPDATE_TRANSFER_LOCAL_STORAGE,
			payload: deploys.transfers ? deploys.transfers : [],
		});
	};
};

export const updateTransferDeployStatus = (publicKey, path, listHash) => {
	return (dispatch) => {
		const deployStorageValue = getLocalStorageValue(publicKey, path) || [];
		const updatedValue = deployStorageValue.map((deploy) => {
			const hashStatus = listHash.find((hash) => hash.hash === deploy.deployHash);
			return { ...deploy, status: hashStatus ? hashStatus.status : deploy.status };
		});
		dispatch(updateTransferDeploysLocalStorage(publicKey, path, updatedValue, 'set'));
	};
};
