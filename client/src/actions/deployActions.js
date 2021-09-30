import { DEPLOY } from '../store/actionTypes';

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
