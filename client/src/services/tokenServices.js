import { CLPublicKey } from 'casper-js-sdk';
import { buildTransferTokenDeploy } from './casperServices';

export const getTransferTokenDeploy = (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, contractInfo = {}, fee } = transactionDetail;
		const { address, decimals } = contractInfo;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		return buildTransferTokenDeploy(fromPbKey, toPbKey, amount * 10 ** decimals.hex, address, fee);
	} catch (error) {
		throw new Error(`Failed to get token transfer deploy.`);
	}
};
