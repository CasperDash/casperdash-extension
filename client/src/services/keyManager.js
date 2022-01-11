import { CLPublicKey, DeployUtil, RuntimeArgs, CLValueBuilder } from 'casper-js-sdk';
import { MOTE_RATE, PAYMENT_AMOUNT, NETWORK_NAME } from '../constants/key';
import { buildContractInstallDeploy } from './casperServices';
import { request } from './request';

const DEPLOY_PAYMENT_AMOUNT = 1 * MOTE_RATE;

/**
 * Builds key-manager deploy that takes entry point and args
 * @param {CLPublicKey} baseAccount base account public key
 * @param {String} entryPoint contract's function name
 * @returns {Deploy} deploy
 */
export const buildKeyManagerDeploy = (baseAccount, entryPoint, args, paymentAmount = PAYMENT_AMOUNT) => {
	const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME);
	const runtimeArgs = RuntimeArgs.fromMap(args);
	const sessionModule = DeployUtil.ExecutableDeployItem.newStoredContractByName(
		'keys_manager',
		entryPoint,
		runtimeArgs,
	);
	const payment = DeployUtil.standardPayment(paymentAmount);
	return DeployUtil.makeDeploy(deployParams, sessionModule, payment);
};

/**
 * Get deploy for key weight with a specified weight
 * @param {CLPublicKey} fromAccount main account public key
 * @param {CLPublicKey} account set account
 * @param {Number} weight
 * @param {number} payment
 * @returns {Deploy} deploy
 */
export const getKeyWeightDeploy = (fromAccount, account, weight, payment) => {
	return buildKeyManagerDeploy(
		fromAccount,
		'set_key_weight',
		{
			account: account,
			weight: CLValueBuilder.u8(weight),
		},
		payment,
	);
};

/**
 * Get deploy for deployment with a specified weight
 * @param {CLPublicKey} fromAccount main account public key
 * @param {Number} weight
 * @returns {Deploy} deploy
 */
export const getDeploymentThresholdDeploy = (fromAccount, weight, payment) => {
	return buildKeyManagerDeploy(
		fromAccount,
		'set_deployment_threshold',
		{
			weight: CLValueBuilder.u8(weight),
		},
		payment,
	);
};

/**
 * Get deploy for key-management threshold with a specified weight
 * @param {CLPublicKey} fromAccount main account public key
 * @param {Number} weight
 * @returns {Deploy} deploy
 */
export const getKeyManagementThresholdDeploy = (fromAccount, weight, payment) => {
	return buildKeyManagerDeploy(
		fromAccount,
		'set_key_management_threshold',
		{
			weight: CLValueBuilder.u8(weight),
		},
		payment,
	);
};

/**
 * Get signed deploy for key weight with a specified weight
 * @param {Number} weight
 * @param {String} mainAccount main account public key hex
 * @param {String} secondAccount target account public key hex
 * @returns {Object} signed deploy Json
 */
export const buildAccountWeightDeploy = async (weight, mainAccount, secondAccount) => {
	try {
		const setAccount = secondAccount || mainAccount;
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const secondAccountPK = CLPublicKey.fromHex(setAccount);
		return getKeyWeightDeploy(mainAccountPK, secondAccountPK, weight, DEPLOY_PAYMENT_AMOUNT);
	} catch (error) {
		console.error(error);
		throw Error('Error on build set account weight deploy');
	}
};

/**
 * Get signed deploy for account deployment threshold with a specified weight
 * @param {Number} weight
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
export const buildAccountDeploymentDeploy = async (weight, mainAccount) => {
	try {
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		return getDeploymentThresholdDeploy(mainAccountPK, weight, DEPLOY_PAYMENT_AMOUNT);
	} catch (error) {
		console.error(error);
		throw Error('Error on build set account deployment deploy');
	}
};

/**
 * Get signed deploy for key management threshold with a specified weight
 * @param {Number} weight
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
export const buildKeyManagementThresholdDeploy = async (weight, mainAccount) => {
	try {
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		return getKeyManagementThresholdDeploy(mainAccountPK, weight, DEPLOY_PAYMENT_AMOUNT);
	} catch (error) {
		console.error(error);
		throw Error('Error on build set account threshold deploy');
	}
};

/**
 * Fetch key manager deploy
 * @param {Number} weight
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
const getKeysManagerDeploy = async () => {
	return await request('/getKeysManagerDeploy');
};

/**
 * Get deploy for keys manager contract
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
export const getKeyManagerContractDeploy = async (mainAccount) => {
	try {
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const deploySession = await getKeysManagerDeploy();
		const deployFromJson = DeployUtil.deployFromJson(deploySession);
		return buildContractInstallDeploy(mainAccountPK, deployFromJson.val.session);
	} catch (error) {
		console.error(error);
		throw Error('Error on build set key manager contract deploy');
	}
};
