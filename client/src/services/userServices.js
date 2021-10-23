import { CLPublicKey } from 'casper-js-sdk';
import * as bip39 from 'bip39';
import { MOTE_RATE } from '../constants/key';
import { getTransferDeploy, signDeploy } from './casperServices';
import { getLocalStorageValue, setLocalStorageValue } from './localStorage';
import Crypto from './cryptoServices';

export const getSignedTransferDeploy = async (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, transferId = 0, fee } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		const transferDeploy = getTransferDeploy(fromPbKey, toPbKey, amount * MOTE_RATE, transferId, fee);
		const signedDeploy = await signDeploy(transferDeploy, fromAddress, toAddress);

		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};

export const getCryptoInstance = (password) => {
	const salt = getLocalStorageValue('encrypted', 'salt');
	const cryptoInstance = new Crypto(password, { salt });
	if (!salt) {
		setLocalStorageValue('encrypted', 'salt', cryptoInstance.salt);
	}
	return cryptoInstance;
};

export const updateStorageWallet = (cryptoInstance, value) => {
	const encryptedValue = cryptoInstance.encrypt(value);
	setLocalStorageValue('encrypted', 'data', encryptedValue);
};

export const getStorageWallet = (cryptoInstance) => {
	const encryptedValue = getLocalStorageValue('encrypted', 'data');
	return cryptoInstance.decryptJson(encryptedValue);
};

export const checkExistWallet = () => {
	const encryptedValue = getLocalStorageValue('encrypted', 'data');
	return Boolean(encryptedValue);
};

export const convertPassPhaseToHex = (passPhase) => {
	return bip39.mnemonicToSeedSync(passPhase).toString('hex');
};

export const convertPassPhaseFromHex = (passPhaseHex) => {
	return bip39.entropyToMnemonic(passPhaseHex);
};

export const convertPassPhaseToSeed = (passPhase) => {
	return bip39.mnemonicToSeedSync(passPhase);
};
