//delegator	016ab2...d638e1
// validator	013cf6...b43507
// amount	1 000 000 000

import { signDeploy } from './casperServices';

const { DeployUtil, RuntimeArgs, CLPublicKey, CLValueBuilder } = require('casper-js-sdk');
const { NETWORK_NAME, MOTE_RATE } = require('../constants/key');

// Entry Point	delegate
const buildStakeDeploy = (baseAccount, entryPoint, args, paymentAmount) => {
	const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME);
	const runTimeArgs = RuntimeArgs.fromMap(args);
	const session = DeployUtil.ExecutableDeployItem.newStoredContractByName('delegate.wasm', entryPoint, runTimeArgs);
	const payment = DeployUtil.standardPayment(paymentAmount);
	return DeployUtil.makeDeploy(deployParams, session, payment);
};

const getStakeDeploy = (fromAccount, validator, fee, amount) => {
	return buildStakeDeploy(
		fromAccount,
		'delegate',
		{
			validator: CLValueBuilder.byteArray(validator.toAccountHash()),
			delegator: CLValueBuilder.byteArray(fromAccount.toAccountHash()),
			amount: CLValueBuilder.u512(amount),
		},
		fee,
	);
};

export const getSignedStakeDeploy = async ({ fromAddress, validator, fee, amount }) => {
	const fromAccPk = CLPublicKey.fromHex(fromAddress);
	const validatorPk = CLPublicKey.fromHex(validator);
	const deploy = getStakeDeploy(fromAccPk, validatorPk, fee * MOTE_RATE, amount * MOTE_RATE);
	const signedDeploy = await signDeploy(deploy, fromAddress, validator);

	return signedDeploy;
};
