import { CLPublicKey } from 'casper-js-sdk';
import { toMotes } from '../helpers/currency';
import { buildTransferDeploy } from './casperServices';

export const getTransferDeploy = (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, transferId = 0, fee } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		return buildTransferDeploy(fromPbKey, toPbKey, toMotes(amount), transferId, fee);
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get signed transfer.`);
	}
};
