import { DeployUtil, CLPublicKey } from 'casper-js-sdk';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import CasperApp from '@zondax/ledger-casper';
import { SECP256k1, CONNECT_ERROR_MESSAGE } from '../constants/ledger';
import { CASPER_KEY_PATH } from '../constants/key';

export const initLedgerApp = async () => {
	const transport = await TransportWebUSB.create();
	return { casperApp: new CasperApp(transport), transport };
};

export const signDeployByLedger = async (deploy, options = {}) => {
	const { casperApp, transport } = await initLedgerApp();
	const responseDeploy = await casperApp.sign(
		`${CASPER_KEY_PATH}${options.keyIndex}`,
		DeployUtil.deployToBytes(deploy),
	);

	if (!responseDeploy.signatureRS) {
		console.error(responseDeploy.errorMessage);
		transport.close();
		throw Error(CONNECT_ERROR_MESSAGE);
	}

	let signedDeploy = DeployUtil.setSignature(
		deploy,
		responseDeploy.signatureRS,
		CLPublicKey.fromHex(options.publicKey),
	);
	signedDeploy = DeployUtil.validateDeploy(signedDeploy);
	if (signedDeploy.ok) {
		signedDeploy.val;
		transport.close();
		return DeployUtil.deployToJson(signedDeploy.val);
	} else {
		transport.close();
		throw new Error('Error on sign deploy with ledger.');
	}
};

export const getLedgerPublicKey = async (app, keyIndex = 0) => {
	const { publicKey = '' } = await app.getAddressAndPubKey(`${CASPER_KEY_PATH}${keyIndex}`);
	if (!publicKey) {
		throw Error(CONNECT_ERROR_MESSAGE);
	}
	return `${SECP256k1}${publicKey.toString('hex')}`;
};

export const getListKeys = async (app, startPath = 0, numberOfKey = 1) => {
	let publicKeys = [];
	for (let index = 0; index < numberOfKey; index++) {
		const keyIndex = startPath + index;
		publicKeys.push({ publicKey: await getLedgerPublicKey(app, keyIndex), path: keyIndex });
	}
	return publicKeys;
};

export const getLedgerError = (error) => {
	if ('TransportInterfaceNotAvailable' === error.name) {
		return CONNECT_ERROR_MESSAGE;
	}
	return error.message;
};
