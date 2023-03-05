import { DeployUtil, RuntimeArgs, CLPublicKey, CLValueBuilder } from 'casper-js-sdk';
import { NETWORK_NAME, ENTRY_POINT_DELEGATE } from '../constants/key';
import { getStakeAuctionHash } from '../constants/stack';
import { toMotes } from '../helpers/currency';

/**
 * It creates a deploy that deploys the auction contract.
 * @param baseAccount - The account that will pay for the deploy.
 * @param entryPoint - The name of the function to be called.
 * @param args - The arguments to pass to the entry point.
 * @param paymentAmount - The amount of tokens to send to the contract.
 * @returns The deploy object.
 */
const buildStakeDeploy = (baseAccount, entryPoint, args, paymentAmount, network) => {
	const deployParams = new DeployUtil.DeployParams(baseAccount, network);
	const runTimeArgs = RuntimeArgs.fromMap(args);
	const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
		getStakeAuctionHash(network).auction,
		entryPoint,
		runTimeArgs,
	);
	const payment = DeployUtil.standardPayment(paymentAmount);
	return DeployUtil.makeDeploy(deployParams, session, payment);
};

/**
 * It builds a StakeDeploy transaction with the given parameters
 * @returns The `StakeDeploy` transaction.
 */
export const getStakeDeploy = ({
	fromAddress,
	validator,
	fee,
	amount,
	entryPoint = ENTRY_POINT_DELEGATE,
	network = NETWORK_NAME,
}) => {
	try {
		const fromAccPk = CLPublicKey.fromHex(fromAddress);
		const validatorPk = CLPublicKey.fromHex(validator);
		return buildStakeDeploy(
			fromAccPk,
			entryPoint,
			{ delegator: fromAccPk, validator: validatorPk, amount: CLValueBuilder.u512(toMotes(amount)) },
			toMotes(fee),
			network,
		);
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get stake deploy.`);
	}
};
