import { Signer } from 'casper-js-sdk';

export const isConnectedCasper = async () => {
	try {
		return await Signer.isConnected();
	} catch (error) {
		return undefined;
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
	const isAvailable = Boolean(window.casperlabsHelper);
	return { isUnlocked: signer.isUnlocked, isConnected: signer.isConnected, isAvailable };
};
