import { signDeploy } from './casperServices';
const { DeployUtil, RuntimeArgs, CLPublicKey, CLValueBuilder } = require('casper-js-sdk');
const { NETWORK_NAME, ENTRY_POINT_DELEGATE } = require('../constants/key');
const { contractHashes } = require('../constants/stack');
const { toMotes } = require('../helpers/currency');

const buildStakeDeploy = (baseAccount, entryPoint, args, paymentAmount) => {
	const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME);
	const runTimeArgs = RuntimeArgs.fromMap(args);
	const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
		contractHashes.auction,
		entryPoint,
		runTimeArgs,
	);
	const payment = DeployUtil.standardPayment(paymentAmount);
	return DeployUtil.makeDeploy(deployParams, session, payment);
};

const getStakeDeploy = (delegator, validator, fee, amount, entryPoint) => {
	return buildStakeDeploy(
		delegator,
		entryPoint,
		{
			delegator,
			validator,
			amount: CLValueBuilder.u512(amount),
		},
		fee,
	);
};

export const getSignedStakeDeploy = async ({
	fromAddress,
	validator,
	fee,
	amount,
	entryPoint = ENTRY_POINT_DELEGATE,
}) => {
	try {
		const fromAccPk = CLPublicKey.fromHex(fromAddress);
		const validatorPk = CLPublicKey.fromHex(validator);
		const deploy = getStakeDeploy(fromAccPk, validatorPk, toMotes(fee), toMotes(amount), entryPoint);
		const signedDeploy = await signDeploy(deploy, fromAddress, validator);
		return signedDeploy;
	} catch (error) {
		throw new Error(`Failed to get signed stake deploy due to ${error}`);
	}
};
