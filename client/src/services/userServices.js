import { CLPublicKey, Signer, DeployUtil } from 'casper-js-sdk';
import { MOTE_RATE } from '../constants/key';
import { getTransferDeploy } from './casperServices';

export const getSignedTransferDeploy = async (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, transactionId = 0 } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		const transferDeploy = getTransferDeploy(fromPbKey, toPbKey, amount * MOTE_RATE, transactionId);
		const deployObj = DeployUtil.deployToJson(transferDeploy);
		console.log(deployObj);
		const signedDeploy = await Signer.sign(deployObj, fromAddress, toAddress);

		return signedDeploy;
	} catch (error) {
		console.log(error);
		return { error: { message: error.message } };
	}
};
