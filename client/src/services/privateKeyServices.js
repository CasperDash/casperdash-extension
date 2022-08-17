import { DeployUtil, Keys } from 'casper-js-sdk';
import UserInstance from '@cd/services/userServices';

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

	const wallet = await user.getWalletAccount(0);
	const publicKey = await wallet.getPublicKeyByteArray();
	const secretKey = wallet.getPrivateKeyByteArray();
	const bsymKey = Keys.Ed25519.parseKeyPair(publicKey.slice(1), secretKey);
	const validate = DeployUtil.validateDeploy(deploy);

	if (!validate) {
		throw new Error('Something went wrong with deploy');
	}

	const signedDeploy = deploy.sign([bsymKey]);
	console.log(`🚀 ~ signDeployByPrivateKey ~ signedDeploy`, signedDeploy);

	return DeployUtil.deployToJson(signedDeploy);
};
