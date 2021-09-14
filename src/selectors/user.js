import _get from 'lodash-es/get';
import { Signer } from 'casper-js-sdk';

export const isConnectedCasper = async () => {
	return await Signer.isConnected();
};

// export const getAddress = async () => {
// 	const isConnected = await isConnectedCasper();
// 	console.log(isConnected);
// 	const publicKey = await Signer.getActivePublicKey();
// 	console.log(publicKey);
// 	return isConnected === true ? publicKey : '';
// };

export const getBalance = ({ userAction }) => {
	return userAction.balance;
};

export const getPublicAddress = ({ userAction }) => {
	return userAction.user.publicAddress;
};

export const getConnectError = ({ userAction }) => {
	return userAction.user.error;
};
