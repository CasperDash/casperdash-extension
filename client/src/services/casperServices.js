import { CasperClient, CasperServiceByJsonRPC, RuntimeArgs, DeployUtil, CLValueBuilder, Signer } from 'casper-js-sdk';
import { NETWORK_NAME, PAYMENT_AMOUNT, TESTNET_RPC_URL } from '../constants/key';

export const client = new CasperClient(TESTNET_RPC_URL);

/**
 * Builds key-manager deploy that takes entrypoint and args
 * @param {CLPublicKey} baseAccount base account public key
 * @param {String} entryPoint contract's function name
 * @returns {Deploy} deploy
 */
const buildKeyManagerDeploy = (baseAccount, entryPoint, args) => {
	const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME);
	const runtimeArgs = RuntimeArgs.fromMap(args);
	const sessionModule = DeployUtil.ExecutableDeployItem.newStoredContractByName(
		'keys_manager',
		entryPoint,
		runtimeArgs,
	);
	const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT);
	return DeployUtil.makeDeploy(deployParams, sessionModule, payment);
};

/**
 * Get deploy for key with a specified weight
 * @param {CLPublicKey} fromAccount main account public key
 * @param {Number} weight
 * @returns {Deploy} deploy
 */
export const getKeyWeightDeploy = (fromAccount, account, weight) => {
	return buildKeyManagerDeploy(fromAccount, 'set_key_weight', {
		account: account,
		weight: CLValueBuilder.u8(weight),
	});
};

/**
 * Get deploy for deployment with a specified weight
 * @param {CLPublicKey} fromAccount main account public key
 * @param {Number} weight
 * @returns {Deploy} deploy
 */
export function getDeploymentThresholdDeploy(fromAccount, weight) {
	return buildKeyManagerDeploy(fromAccount, 'set_deployment_threshold', {
		weight: CLValueBuilder.u8(weight),
	});
}

/**
 * Get the current state of the account
 * @param {CLPublicKey} fromAccount main account public key
 * @returns {Object} account state
 */
const getAccount = async (publicKey) => {
	const c = new CasperServiceByJsonRPC(TESTNET_RPC_URL);
	const stateRootHash = (await c.getLatestBlockInfo()).block.header.state_root_hash;
	const account = await c.getBlockState(stateRootHash, publicKey.toAccountHashStr(), []).then((res) => res.Account);
	return account;
};

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
	const transferParams = DeployUtil.ExecutableDeployItem.newTransferWithOptionalTransferId(
		amount,
		toAccount,
		null,
		transactionId,
	);
	const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT);
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
	const runtimeArgs = RuntimeArgs.fromMap(args);
	const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT);
	return DeployUtil.makeDeploy(deployParams, session, payment);
};

/**
 * Sign a deploy by singer
 * @param {Deploy} deploy main account public key
 * @param {String} mainAccountHex hash contract content
 * @param {String} setAccountHex contract's arguments
 * @returns {Deploy} Singed deploy
 */
export const signDeploy = async (deploy, mainAccountHex, setAccountHex) => {
	const deployObj = DeployUtil.deployToJson(deploy);
	const signedDeploy = await Signer.sign(deployObj, mainAccountHex, setAccountHex);
	return signedDeploy;
};
