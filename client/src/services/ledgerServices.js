import { DeployUtil, CLPublicKey } from 'casper-js-sdk';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import CasperApp from '@zondax/ledger-casper';
import { SECP256k1, CONNECT_ERROR_MESSAGE } from '../constants/ledger';
import { CASPER_KEY_PATH } from '../constants/key';

/**
 * Initial ledger app
 */
export const initLedgerApp = async () => {
	const transport = await TransportWebUSB.create();
	return { casperApp: new CasperApp(transport), transport };
};

/**
 * Sign deploy by ledger
 * @param {object} deploy
 * @param {object} options
 */
export const signDeployByLedger = async (deploy, options = {}) => {
	const { casperApp, transport } = await initLedgerApp();

	const responseDeploy = await casperApp.sign(
		`${CASPER_KEY_PATH}${options.keyIndex}`,
		DeployUtil.deployToBytes(deploy),
	);

	if (!responseDeploy.signatureRS) {
		console.error(responseDeploy.errorMessage);
		transport.close();
		throw Error(getLedgerError({ message: responseDeploy.errorMessage }, responseDeploy.returnCode));
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

/**
 * Get public key from ledger
 * @param {object} app casper app
 * @param {number} keyIndex ledger key index
 */
export const getLedgerPublicKey = async (app, keyIndex = 0) => {
	const { publicKey = '' } = await app.getAddressAndPubKey(`${CASPER_KEY_PATH}${keyIndex}`);

	if (!publicKey) {
		throw Error(CONNECT_ERROR_MESSAGE);
	}
	return `${SECP256k1}${publicKey.toString('hex')}`;
};

/**
 * Get list public key from ledger
 * @param {object} app casper app object
 * @param {number} startPath start index
 * @param {number} numberOfKey number of keys that want to get
 */
export const getListKeys = async (app, startPath = 0, numberOfKey = 1) => {
	let publicKeys = [];
	for (let index = 0; index < numberOfKey; index++) {
		const keyIndex = startPath + index;
		publicKeys.push({ publicKey: await getLedgerPublicKey(app, keyIndex), keyIndex });
	}
	return publicKeys;
};

/**
 * Get Ledger error message
 * @param {object} error
 * @param {number} code
 */
export const getLedgerError = (error, code) => {
	if ('TransportInterfaceNotAvailable' === error.name || code === 27014) {
		return CONNECT_ERROR_MESSAGE;
	}
	if (code === 27012) {
		return 'Unsupported Deploy';
	}
	return error.message;
};
