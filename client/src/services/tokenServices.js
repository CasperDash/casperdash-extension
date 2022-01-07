import { CLPublicKey } from 'casper-js-sdk';
import { getTransferTokenDeploy, signDeploy } from './casperServices';

export const getSignedTransferTokenDeploy = async (transactionDetail = {}, ledgerOptions) => {
	try {
		const { fromAddress, toAddress, amount, contractInfo = {}, fee } = transactionDetail;
		const { address, decimals } = contractInfo;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		const transferDeploy = getTransferTokenDeploy(fromPbKey, toPbKey, amount * 10 ** decimals.hex, address, fee);
		const signedDeploy = await signDeploy(transferDeploy, fromAddress, toAddress, ledgerOptions);

		return signedDeploy;
	} catch (error) {
		throw new Error(`Failed to get signed stake deploy.`);
	}
};
