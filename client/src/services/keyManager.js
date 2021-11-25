import { CLPublicKey, DeployUtil, RuntimeArgs, CLValueBuilder } from 'casper-js-sdk';
import { MOTE_RATE, PAYMENT_AMOUNT, NETWORK_NAME } from '../constants/key';
import { buildContractInstallDeploy, signDeploy } from './casperServices';

const DEPLOY_PAYMENT_AMOUNT = 1 * MOTE_RATE;

/**
 * Builds key-manager deploy that takes entry point and args
 * @param {CLPublicKey} baseAccount base account public key
 * @param {String} entryPoint contract's function name
 * @returns {Deploy} deploy
 */
const buildKeyManagerDeploy = (baseAccount, entryPoint, args, paymentAmount = PAYMENT_AMOUNT) => {
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
 * @param {Number} weight
 * @returns {Deploy} deploy
 */
const getKeyWeightDeploy = (fromAccount, account, weight, payment) => {
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
const getDeploymentThresholdDeploy = (fromAccount, weight, payment) => {
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
const getKeyManagementThresholdDeploy = (fromAccount, weight, payment) => {
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
export const getSignedAccountWeightDeploy = async (weight, mainAccount, secondAccount) => {
	try {
		const setAccount = secondAccount || mainAccount;
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const secondAccountPK = CLPublicKey.fromHex(setAccount);
		const deploy = getKeyWeightDeploy(mainAccountPK, secondAccountPK, weight, DEPLOY_PAYMENT_AMOUNT);
		const signedDeploy = await signDeploy(deploy, mainAccount, setAccount);
		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};

/**
 * Get signed deploy for account deployment threshold with a specified weight
 * @param {Number} weight
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
export const getSignedAccountDeploymentDeploy = async (weight, mainAccount) => {
	try {
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const deploy = getDeploymentThresholdDeploy(mainAccountPK, weight, DEPLOY_PAYMENT_AMOUNT);
		const signedDeploy = await signDeploy(deploy, mainAccount, mainAccount);
		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};

/**
 * Get signed deploy for key management threshold with a specified weight
 * @param {Number} weight
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
export const getSignedKeyManagementThresholdDeploy = async (weight, mainAccount) => {
	try {
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const deploy = getKeyManagementThresholdDeploy(mainAccountPK, weight, DEPLOY_PAYMENT_AMOUNT);
		const signedDeploy = await signDeploy(deploy, mainAccount, mainAccount);
		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};

/**
 * Fetch key manager deploy
 * @param {Number} weight
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
const getKeysManagerDeploy = async () => {
	//const data = await request('/getKeysManagerDeploy');
	return {};
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
		const deploy = buildContractInstallDeploy(mainAccountPK, deployFromJson.val.session);
		const signedDeploy = await signDeploy(deploy, mainAccount, mainAccount);
		delete signedDeploy.deploy.session;
		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};
