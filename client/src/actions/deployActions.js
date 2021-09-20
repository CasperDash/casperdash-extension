import { DEPLOY } from '../store/actionTypes';

export const putDeploy = (signedDeploy) => ({
	type: DEPLOY.PUT_DEPLOY,
	request: {
		method: 'POST',
		url: '/deploy',
		data: signedDeploy,
	},
});
