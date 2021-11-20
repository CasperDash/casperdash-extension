/* eslint-disable complexity */
import { CLPublicKey } from 'casper-js-sdk';

/**
 * Check value is public key.
 * @param {String}  - Public key.
 * @return {Boolean} - Is valid public key
 */
export const isValidPublicKey = (publicKey) => {
	try {
		const pbKey = CLPublicKey.fromHex(publicKey);
		return pbKey ? true : false;
	} catch (error) {
		return false;
	}
};

/**
 * Validate transfer form.
 * @param {Object}  - Transfer object.
 * @return {Object} - Error object
 */
export const validateTransferForm = ({
	displayBalance,
	toAddress,
	sendAmount,
	tokenSymbol,
	minAmount,
	csprBalance,
	transferFee,
}) => {
	let errors = {};
	// to address
	if (!toAddress) {
		return { toAddress: 'Required.' };
	}
	if (!isValidPublicKey(toAddress)) {
		return { toAddress: 'Invalid address.' };
	}
	// send amount
	if (sendAmount < minAmount) {
		return { sendAmount: `Amount must be at least ${minAmount} ${tokenSymbol}.` };
	}
	if (sendAmount <= 0) {
		return { sendAmount: `Amount must be more than 0 ${tokenSymbol}.` };
	}
	if (sendAmount > displayBalance) {
		return { sendAmount: 'Not enough balance.' };
	}
	if (tokenSymbol === 'CSPR' && sendAmount + transferFee > displayBalance) {
		return { sendAmount: 'Not enough balance.' };
	}
	//cspr balance
	if (csprBalance < transferFee) {
		return { transferFee: 'Not enough CSPR balance.' };
	}
	return errors;
};
