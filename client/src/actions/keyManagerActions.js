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
