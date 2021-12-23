import { DeployUtil, CLPublicKey } from 'casper-js-sdk';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import CasperApp from '@zondax/ledger-casper';

export const signByLedger = async (deployObj, options = {}) => {
	const transport = await TransportWebUSB.create();
	const app = new CasperApp(transport);
	const responseDeploy = await app.sign(`m/44'/506'/0'/0/${options.keyPath}`, DeployUtil.deployToBytes(deployObj));
	let signedDeploy = DeployUtil.setSignature(
		deployObj,
		responseDeploy.signatureRS,
		CLPublicKey.fromHex(options.publicKey),
	);
	signedDeploy = DeployUtil.validateDeploy(signedDeploy);
	if (signedDeploy.ok) {
		return signedDeploy.val;
	} else {
		throw signedDeploy.val;
	}
};
