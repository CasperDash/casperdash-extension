import { CLPublicKey } from 'casper-js-sdk';

export const getBalance = ({ user }) => {
	return user.balance;
};

export const getPublicKey = ({ user }) => {
	if (user.publicKey) {
		const toPublicKey = CLPublicKey.fromHex(user.publicKey);
		console.log(toPublicKey);
	}
	return user.publicKey;
};
