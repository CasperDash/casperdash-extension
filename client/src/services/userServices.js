import { CLPublicKey } from 'casper-js-sdk';
import { toMotes } from '../helpers/currency';
import { getTransferDeploy, signDeploy } from './casperServices';

export const getSignedTransferDeploy = async (transactionDetail = {}, ledgerOptions) => {
	try {
		const { fromAddress, toAddress, amount, transferId = 0, fee } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		const transferDeploy = getTransferDeploy(fromPbKey, toPbKey, toMotes(amount), transferId, fee);
		const signedDeploy = await signDeploy(transferDeploy, fromAddress, toAddress, ledgerOptions);

		return signedDeploy;
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get signed transfer.`);
	}
};
