import { CLPublicKey, Signer, DeployUtil } from 'casper-js-sdk';
import { MOTE_RATE } from '../constants/key';
import { getTransferDeploy } from './casperServices';
import { putDeploy } from './request';

export const deployTransfer = async (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		const transferDeploy = getTransferDeploy(fromPbKey, toPbKey, amount * MOTE_RATE);
		console.log(transferDeploy);
		const obj = DeployUtil.deployToJson(transferDeploy); //JSON.parse(JSON.stringify(transferDeploy));
		const signedDeploy = await Signer.sign(obj, fromAddress, toAddress);
		console.log(signedDeploy);
		//const deploy = DeployUtil.deployFromJson(signedDeploy);
		//console.log(deploy);
		const hash = await putDeploy(signedDeploy);
		console.log(hash);
		return hash;
	} catch (error) {
		console.log(error);
	}
};
