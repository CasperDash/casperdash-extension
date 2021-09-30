import { CLPublicKey } from 'casper-js-sdk';
import { MIN_TRANSFER } from '../constants/key';

const isValidPublicKey = (publicKey) => {
	try {
		const pbKey = CLPublicKey.fromHex(publicKey);
		return pbKey ? true : false;
	} catch (error) {
		return false;
	}
};

export const validateTransferForm = ({ displayBalance, toAddress, sendAmount, tokenSymbol, minAmount }) => {
	let errors = {};
	// to address
	if (!toAddress) {
		errors.toAddress = 'Required.';
	}
	if (!errors.toAddress && !isValidPublicKey(toAddress)) {
		errors.toAddress = 'Invalid address.';
	}
	// send amount
	if (sendAmount < minAmount) {
		errors.sendAmount = `Amount must be at least ${minAmount} ${tokenSymbol}.`;
	}
	if (sendAmount <= 0) {
		errors.sendAmount = `Amount must be more than 0 ${tokenSymbol}.`;
	}
	if (!errors.sendAmount && sendAmount > displayBalance) {
		errors.sendAmount = 'Not enough balance.';
	}
	return errors;
};
