import { Signer } from 'casper-js-sdk';

export const isConnectedCasper = async () => {
	try {
		return await Signer.isConnected();
	} catch (error) {
		console.warn(error);
	}
};

export const isLockedCasper = async () => {
	try {
		await Signer.getActivePublicKey();
	} catch (error) {
		return true;
	}
	return false;
};

export const getConnectError = ({ signer }) => {
	return signer.error;
};

export const getSignerStatus = ({ signer }) => {
	return { isUnlocked: signer.isUnlocked, isConnected: signer.isConnected };
};
