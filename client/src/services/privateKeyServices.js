import { DeployUtil, Signer, RuntimeArgs, CLValueBuilder, CLAccountHash, CLKey, CLTypeBuilder } from 'casper-js-sdk';

/**
 * Sign a deploy by singer
 * @param {Deploy} deploy main account public key
 * @param {String} mainAccountHex hash contract content
 * @param {String} setAccountHex contract's arguments
 * @returns {Deploy} Signed deploy
 */
export const signDeployByPrivateKey = async (deploy) => {
console.log(`🚀 ~ signDeployByPrivateKey ~ deploy`, deploy)
	const signedDeploy = await deploy.sign();
  console.log(`🚀 ~ signDeployByPrivateKey ~ signedDeploy`, signedDeploy)
	return signedDeploy;
};