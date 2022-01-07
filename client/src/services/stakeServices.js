import { DeployUtil, RuntimeArgs, CLPublicKey, CLValueBuilder } from 'casper-js-sdk';
import { NETWORK_NAME, ENTRY_POINT_DELEGATE } from '../constants/key';
import { contractHashes } from '../constants/stack';
import { toMotes } from '../helpers/currency';

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

export const getStakeDeploy = async ({ fromAddress, validator, fee, amount, entryPoint = ENTRY_POINT_DELEGATE }) => {
	try {
		const fromAccPk = CLPublicKey.fromHex(fromAddress);
		const validatorPk = CLPublicKey.fromHex(validator);
		return buildStakeDeploy(
			fromAccPk,
			entryPoint,
			{ fromAccPk, validatorPk, amount: CLValueBuilder.u512(toMotes(amount)) },
			toMotes(fee),
		);
	} catch (error) {
		throw new Error(`Failed to get signed stake deploy.`);
	}
};
