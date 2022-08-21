import { DeployUtil } from 'casper-js-sdk';
import UserInstance from '@cd/services/UserService';

/**
 * Sign a deploy by singer
 * @param {Deploy} deploy main account public key
 * @returns {Deploy} Signed deploy
 */
export const signDeployByPrivateKey = async (deploy) => {
	const user = UserInstance.instance;
	if (!user) {
		throw new Error('User missing');
	}

	const asymKey = await UserInstance.generateKeypair();
	const validate = DeployUtil.validateDeploy(deploy);

	if (!validate || !asymKey) {
		throw new Error('Something went wrong with deploy');
	}

	const signedDeploy = deploy.sign([asymKey]);
	console.log(`🚀 ~ signDeployByPrivateKey ~ signedDeploy`, signedDeploy);

	return DeployUtil.deployToJson(signedDeploy);
};
