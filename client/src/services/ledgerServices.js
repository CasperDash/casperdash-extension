import { DeployUtil, CLPublicKey } from 'casper-js-sdk';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import CasperApp from '@zondax/ledger-casper';

export const signByLedger = async (deployObj, options = {}) => {
	const responseDeploy = await options.app.sign(
		`m/44'/506'/0'/0/${options.keyPath}`,
		DeployUtil.deployToBytes(deployObj),
	);

	if (!responseDeploy.signatureRS) {
		throw new Error(responseDeploy.errorMessage);
	}

	let signedDeploy = DeployUtil.setSignature(
		deployObj,
		responseDeploy.signatureRS,
		CLPublicKey.fromHex(options.publicKey),
	);
	signedDeploy = DeployUtil.validateDeploy(signedDeploy);
	if (signedDeploy.ok) {
		return signedDeploy.val;
	} else {
		throw new Error(signedDeploy.val);
	}
};

export const initLedgerApp = async () => {
	const transport = await TransportWebUSB.create();
	return new CasperApp(transport);
};

export const getLedgerPublicKey = async (app, keyPath = 0) => {
	return await app.getAddressAndPubKey(`m/44'/506'/0'/0/${keyPath}`);
};

export const handleLedgerError = (error) => {
	if ('TransportInterfaceNotAvailable' === error.name) {
		alert('You must open the Casper app on your Ledger device to connect.');
	} else if ('TransportOpenUserCancelled' === error.name) {
		alert(error.message);
	} else {
		alert(error);
	}
};
