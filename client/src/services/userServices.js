import { NETWORK_NAME } from '@cd/constants/key';
import { CLPublicKey } from 'casper-js-sdk';
import { toMotes } from '../helpers/currency';
import { buildTransferDeploy } from './casperServices';

/**
 * It builds a transfer deploy.
 * @param transactionDetail
 * @returns The transfer deploy.
 */
export const getTransferDeploy = (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, transferId = 0, fee, network = NETWORK_NAME } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		return buildTransferDeploy(fromPbKey, toPbKey, toMotes(amount), transferId, fee, network);
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to build transfer deploy.`);
	}
};
