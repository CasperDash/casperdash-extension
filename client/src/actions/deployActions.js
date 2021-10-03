import { DEPLOY } from '../store/actionTypes';
import { setLocalStorageValue } from '../services/localStorage';

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
