import { DeployUtil, Signer } from 'casper-js-sdk';
import { NETWORK_NAME, PAYMENT_AMOUNT, MOTE_RATE, TRANSFER_FEE, TESTNET_RPC_URL } from '../constants/key';

/**
 * Get Transfer deploy
 * @param {CLPublicKey} fromAccount main account public key
 * @param {CLPublicKey} toAccount public key of target account
 * @param {Number} amount transfer amount
 * @param {Number} transactionId transfer id. This parameter is optional
 * @returns {Deploy} transfer deploy
 */
export const getTransferDeploy = (fromAccount, toAccount, amount, transactionId) => {
	const deployParams = new DeployUtil.DeployParams(fromAccount, NETWORK_NAME);
	const transferParams = DeployUtil.ExecutableDeployItem.newTransfer(amount, toAccount, null, transactionId);
	const payment = DeployUtil.standardPayment(TRANSFER_FEE * MOTE_RATE);
	return DeployUtil.makeDeploy(deployParams, transferParams, payment);
};

/**
 * Build deploy for contract
 * @param {CLPublicKey} baseAccount main account public key
 * @param {Object} session hash contract content
 * @param {Object} args contract's arguments
 * @returns {Deploy} deploy of the contract
 */
export const buildContractInstallDeploy = async (baseAccount, session, args = {}) => {
	const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME);
	const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT);
	return DeployUtil.makeDeploy(deployParams, session, payment);
};

/**
 * Sign a deploy by singer
 * @param {Deploy} deploy main account public key
 * @param {String} mainAccountHex hash contract content
 * @param {String} setAccountHex contract's arguments
 * @returns {Deploy} Signed deploy
 */
export const signDeploy = async (deploy, mainAccountHex, setAccountHex) => {
	const deployObj = DeployUtil.deployToJson(deploy);
	const signedDeploy = await Signer.sign(deployObj, mainAccountHex, setAccountHex);
	return signedDeploy;
};

export const connectCasperSigner = () => {
	try {
		Signer.sendConnectionRequest();
	} catch (error) {
		return error.message;
	}
};
