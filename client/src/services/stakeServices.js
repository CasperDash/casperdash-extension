import { signDeploy } from './casperServices';

const { DeployUtil, RuntimeArgs, CLPublicKey, CLValueBuilder } = require('casper-js-sdk');
const { NETWORK_NAME, MOTE_RATE, ENTRY_POINT_DELEGATE } = require('../constants/key');
const { contractHashs } = require('../shared/constants');

const buildStakeDeploy = (baseAccount, entryPoint, args, paymentAmount) => {
	const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME);
	const runTimeArgs = RuntimeArgs.fromMap(args);
	const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
		contractHashs.auction,
		entryPoint,
		runTimeArgs,
	);
	const payment = DeployUtil.standardPayment(paymentAmount);
	return DeployUtil.makeDeploy(deployParams, session, payment);
};

const getStakeDeploy = (delegator, validator, fee, amount) => {
	return buildStakeDeploy(
		delegator,
		ENTRY_POINT_DELEGATE,
		{
			delegator,
			validator,
			amount: CLValueBuilder.u512(amount),
		},
		fee,
	);
};

export const getSignedStakeDeploy = async ({ fromAddress, validator, fee, amount }) => {
	const fromAccPk = CLPublicKey.fromHex(fromAddress);
	const validatorPk = CLPublicKey.fromHex(validator);
	const deploy = getStakeDeploy(fromAccPk, validatorPk, fee * MOTE_RATE, amount * MOTE_RATE);
	try {
		const signedDeploy = await signDeploy(deploy, fromAddress, validator);
		return signedDeploy;
	} catch (error) {
		throw error;
	}
};
