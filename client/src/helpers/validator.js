/* eslint-disable complexity */
import { CLPublicKey } from 'casper-js-sdk';
import { ENTRY_POINT_DELEGATE, ENTRY_POINT_UNDELEGATE } from '../constants/key';

export const isValidPublicKey = (publicKey) => {
	try {
		const pbKey = CLPublicKey.fromHex(publicKey);
		return pbKey ? true : false;
	} catch (error) {
		return false;
	}
};

const COMMON_ERROR_MESSAGE = {
	MORE_THAN_ZERO: (tokenSymbol) => `Amount must be more than 0 ${tokenSymbol}.`,
	NOT_ENOUGH_BALANCE: 'Not enough balance.',
};

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
	if (!errors.sendAmount && tokenSymbol === 'CSPR' && sendAmount + transferFee > displayBalance) {
		errors.sendAmount = 'Not enough balance.';
	}
	//cspr balance
	if (csprBalance < transferFee) {
		errors.transferFee = 'Not enough CSPR balance.';
	}
	return errors;
};

export const validateStakeForm = ({ amount, tokenSymbol, balance, fee, action }) => {
	let errors = {};
	if (amount <= 0) {
		errors.amount = COMMON_ERROR_MESSAGE.MORE_THAN_ZERO(tokenSymbol);
	} else if (ENTRY_POINT_DELEGATE === action && amount + fee > balance.accountBalance) {
		errors.amount = COMMON_ERROR_MESSAGE.NOT_ENOUGH_BALANCE;
	} else if (ENTRY_POINT_UNDELEGATE === action) {
		if (fee > balance.accountBalance || amount > balance.validatorStakedBalance) {
			errors.amount = COMMON_ERROR_MESSAGE.NOT_ENOUGH_BALANCE;
		}
	}

	return errors;
};
