import { CLPublicKey } from 'casper-js-sdk';
import { buildTransferTokenDeploy } from './casperServices';

/**
 * It builds a transfer token deploy.
 * @param [transactionDetail] - {
 * @returns The transaction object.
 */
export const getTransferTokenDeploy = (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, contractInfo = {}, fee, network } = transactionDetail;
		const { address, decimals } = contractInfo;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		return buildTransferTokenDeploy(fromPbKey, toPbKey, amount * 10 ** decimals.hex, address, fee, network);
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get token transfer deploy.`);
	}
};
