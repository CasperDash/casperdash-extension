import { DeployUtil } from 'casper-js-sdk';
import { onSignPrivateKeySW } from '@cd/components/hooks/useServiceWorker';
// import UserInstance from '@cd/services/UserService';

/**
 * Sign a deploy by singer
 * @param {Deploy} deploy main account public key
 * @returns {Deploy} Signed deploy
 */
export const signDeployByPrivateKey = async (deploy) => {
	// const user = UserInstance.instance;
	// if (!user) {
	// 	throw new Error('User missing');
	// }

	const validate = DeployUtil.validateDeploy(deploy);

	if (!validate) {
		throw new Error('Something went wrong with deploy');
	}

	const deployJSON = DeployUtil.deployToJson(deploy);
	const result = await onSignPrivateKeySW(deployJSON);
	console.log(`🚀 ~ signDeployByPrivateKey ~ result`, result)

	return result;
};
