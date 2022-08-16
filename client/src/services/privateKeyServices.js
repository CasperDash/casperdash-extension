import { DeployUtil, Signer, RuntimeArgs, CLValueBuilder, CLAccountHash, CLKey, CLTypeBuilder } from 'casper-js-sdk';
import UserInstance from "@cd/services/userServices";

/**
 * Sign a deploy by singer
 * @param {Deploy} deploy main account public key
 * @param {String} mainAccountHex hash contract content
 * @param {String} setAccountHex contract's arguments
 * @returns {Deploy} Signed deploy
 */
export const signDeployByPrivateKey = async (deploy, mainAccountHex, setAccountHex) => {
  const user = UserInstance.instance;
  if (!user) {
    throw new Error("User missing");
  }

  console.log(`🚀 ~ >>> USER:`, user)
  const wallet = await user.getWalletAccount(0);
  
  console.log(`🚀 ~ >>> WALLET: `, wallet)
  const asymKeys = wallet.getAsymmetricKey();
  console.log(`🚀 ~ >>> asymKeys: `, asymKeys)
  
  console.log(`🚀 ~ signDeployByPrivateKey ~ deploy`, deploy);
  // const deployObj = DeployUtil.deployToJson(deploy);
  // console.log(`🚀 ~ signDeployByPrivateKey ~ deployObj`, deployObj)
  
  const { hash, header, payment, session } = deploy;
  const insDeploy = new DeployUtil.Deploy(hash, header, payment, session);
  console.log(`🚀 ~ signDeployByPrivateKey ~ insDeploy`, insDeploy)
  const signedDeploy = await insDeploy.sign([asymKeys]);
  console.log(`🚀 ~ signDeployByPrivateKey ~ signedDeploy`, signedDeploy)

  // NOT WORK
  // const signedDeploy = await deploy.sign([asymKeys]);
  // console.log(`🚀 ~ signDeployByPrivateKey ~ signedDeploy`, signedDeploy);

  // NOT WORK
  // const signedDeploy = await Signer.sign(deployObj, mainAccountHex, setAccountHex);
  // console.log(`🚀 ~ signDeployByPrivateKey ~ signedDeploy`, signedDeploy)
	return signedDeploy;
};
