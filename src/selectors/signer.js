import { Signer } from 'casper-js-sdk';

export const isConnectedCasper = async () => {
	return await Signer.isConnected();
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
