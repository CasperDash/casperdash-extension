import { CLPublicKey } from 'casper-js-sdk';
import { getTransferTokenDeploy, signDeploy } from './casperServices';

export const getSignedTransferTokenDeploy = async (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, contractInfo = {} } = transactionDetail;
		const { address, decimals } = contractInfo;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		const transferDeploy = getTransferTokenDeploy(fromPbKey, toPbKey, amount * 10 ** decimals.hex, address);
		const signedDeploy = await signDeploy(transferDeploy, fromAddress, toAddress);

		return signedDeploy;
	} catch (error) {
		console.log(error);
		return { error: { message: error.message } };
	}
};
