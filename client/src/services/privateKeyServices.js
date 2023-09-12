import { DeployUtil } from 'casper-js-sdk';
import { onSignPrivateKeySW } from '@cd/components/hooks/useServiceWorker';

/**
 * Sign a deploy by singer
 * @param {Deploy} deploy main account public key
 * @returns {Deploy} Signed deploy
 */
export const signDeployByPrivateKey = async (deploy) => {
	const validate = DeployUtil.validateDeploy(deploy);

	if (!validate) {
		throw new Error('Something went wrong with deploy');
	}

	const deployJSON = DeployUtil.deployToJson(deploy);
	return onSignPrivateKeySW(deployJSON);
};
