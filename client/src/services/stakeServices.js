import { DeployUtil, RuntimeArgs, CLPublicKey, CLValueBuilder } from 'casper-js-sdk';
import { NETWORK_NAME, ENTRY_POINT_DELEGATE } from '../constants/key';
import { contractHashes } from '../constants/stack';
import { toMotes } from '../helpers/currency';
import { signDeploy } from './casperServices';

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

export const getSignedStakeDeploy = async (
	{ fromAddress, validator, fee, amount, entryPoint = ENTRY_POINT_DELEGATE },
	ledgerOptions,
) => {
	try {
		const fromAccPk = CLPublicKey.fromHex(fromAddress);
		const validatorPk = CLPublicKey.fromHex(validator);
		const deploy = getStakeDeploy(fromAccPk, validatorPk, toMotes(fee), toMotes(amount), entryPoint);
		const signedDeploy = await signDeploy(deploy, fromAddress, validator, ledgerOptions);
		return signedDeploy;
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get signed stake deploy.`);
	}
};
