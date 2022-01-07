import { CLPublicKey } from 'casper-js-sdk';
import { toMotes } from '../helpers/currency';
import { getTransferDeploy } from './casperServices';

export const getSignedTransferDeploy = async (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, transferId = 0, fee } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		return getTransferDeploy(fromPbKey, toPbKey, toMotes(amount), transferId, fee);
	} catch (error) {
		throw new Error(`Failed to get signed transfer.`);
	}
};
