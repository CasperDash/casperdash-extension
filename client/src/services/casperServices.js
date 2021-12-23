import { DeployUtil, Signer, RuntimeArgs, CLValueBuilder, CLAccountHash, CLKey } from 'casper-js-sdk';
import { NETWORK_NAME, PAYMENT_AMOUNT, MOTE_RATE, DEPLOY_TTL_MS } from '../constants/key';
import { signByLedger } from '../services/ledgerServices';

/**
 * Get Transfer deploy
 * @param {CLPublicKey} fromAccount main account public key
 * @param {CLPublicKey} toAccount public key of target account
 * @param {Number} amount transfer amount
 * @param {Number} transferId transfer id. This parameter is optional
 * @param {Number} fee transfer fee
 * @returns {Deploy} transfer deploy
 */
export const getTransferDeploy = (fromAccount, toAccount, amount, transferId, fee) => {
	const deployParams = new DeployUtil.DeployParams(fromAccount, NETWORK_NAME);
	const transferParams = DeployUtil.ExecutableDeployItem.newTransfer(amount, toAccount, null, transferId);
	const payment = DeployUtil.standardPayment(fee * MOTE_RATE);
	return DeployUtil.makeDeploy(deployParams, transferParams, payment);
};

/**
 * Build deploy for contract
 * @param {CLPublicKey} baseAccount main account public key
 * @param {Object} session hash contract content
 * @returns {Deploy} deploy of the contract
 */
export const buildContractInstallDeploy = (baseAccount, session) => {
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
export const signDeploy = async (deploy, mainAccountHex, setAccountHex, casperApp) => {
	try {
		if (!casperApp) {
			const deployObj = DeployUtil.deployToJson(deploy);
			const signedDeploy = await Signer.sign(deployObj, mainAccountHex, setAccountHex);
			return signedDeploy;
		} else {
			const signedDeploy = await signByLedger(deploy, {
				publicKey: mainAccountHex,
				keyPath: 0,
				app: casperApp,
			});
			return DeployUtil.deployToJson(signedDeploy);
		}
	} catch (error) {
		return { error: { message: error.message } };
	}
};

/**
 * Get Transfer Token deploy
 * @param {CLPublicKey} fromAccount from account public key
 * @param {CLPublicKey} toAccount to account public key
 * @param {Number} amount transfer amount
 * @param {String} contractHash token contract hash
 * @returns {Deploy} transfer deploy
 */
export const getTransferTokenDeploy = (fromAccount, toAccount, amount, contractHash, fee) => {
	const contractHashAsByteArray = [...Buffer.from(contractHash, 'hex')];
	const deployParams = new DeployUtil.DeployParams(fromAccount, NETWORK_NAME, 1, DEPLOY_TTL_MS);
	const transferParams = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
		contractHashAsByteArray,
		'transfer',
		RuntimeArgs.fromMap({
			amount: CLValueBuilder.u256(amount),
			recipient: new CLKey(new CLAccountHash(toAccount.toAccountHash())),
		}),
	);
	const payment = DeployUtil.standardPayment(fee * MOTE_RATE);
	return DeployUtil.makeDeploy(deployParams, transferParams, payment);
};

/**
 * Request to connect with signer
 * @returns {string} error message
 */
export const connectCasperSigner = () => {
	try {
		Signer.sendConnectionRequest();
	} catch (error) {
		return error.message;
	}
};
