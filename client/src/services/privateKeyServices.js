import isFunction from "lodash-es/isFunction";
import { DeployUtil, Keys, Signer, RuntimeArgs, CLValueBuilder, CLAccountHash, CLKey, CLTypeBuilder } from 'casper-js-sdk';
import { EncryptionType } from 'casper-storage';
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
  console.log(`🚀 ~ 0: `, DeployUtil)

  console.log(`🚀 ~ >>> USER:`, user)
  const wallet = await user.getWalletAccount(0);

  console.log(`🚀 ~ >>> WALLET: `, wallet);
  const publicKey = await wallet.getPublicAddressByteArray();
  const secretKey = wallet.getPrivateKeyByteArray();
  console.log(`🚀 ~ file: privateKeyServices.js ~ line 26 ~ signDeployByPrivateKey ~ secretKey`, secretKey)

  // const asymKeys = wallet.getAsymmetricKey();
  // console.log(`🚀 ~ >>> asymKeys: `, asymKeys)

  const bsymKey = new Keys.Ed25519({ publicKey, secretKey })
  console.log(`🚀 ~ >>> BKey: `, bsymKey)

  // console.log(">>> ZZZZZZ2 deploy:: ", deploy);

  const validate = DeployUtil.validateDeploy(deploy);
  console.log(`🚀 ~ file: privateKeyServices.js ~ line 45 ~ signDeployByPrivateKey ~ validate`, validate);
  const isFunc = isFunction(deploy.sign);
  console.log(`🚀 ~ file: privateKeyServices.js ~ line 49 ~ signDeployByPrivateKey ~ isFunc`, isFunc)

  /** Use `Deploy.sign` from API */
  // const signedDeploy = deploy.sign([bsymKey]);
  // console.log(`🚀 ~ file: privateKeyServices.js ~ line 49 ~ signDeployByPrivateKey ~ signedDeploy`, signedDeploy)

  // debugger;
  const signedDeploy = DeployUtil.signDeploy(deploy, bsymKey);
  console.log(`🚀 ~ signDeployByPrivateKey ~ signedDeploy`, signedDeploy)

	return signedDeploy;
};
