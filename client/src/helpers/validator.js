/* eslint-disable complexity */
import { CLPublicKey } from 'casper-js-sdk';
import { MAX_METADATA_ATTRIBUTES } from '../constants/nft';
import { VALIDATOR_REACHED_MAXIMUM } from '@cd/constants/staking';

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
 * validate NFT Mint Form
 * @param {object} values
 */
export const validateNFTMintForm = (values) => {
	let errors = {};
	if (!values.nftContract) {
		errors.nftContract = 'Required';
	}
	if (!values.name) {
		errors.name = 'Required';
	}
	if (!values.image) {
		errors.image = 'Required';
	}
	if (values.image && values.image.type && !values.image.type.includes('image')) {
		errors.image = 'Should be image.';
	}
	if (values.toAddress && !isValidPublicKey(values.toAddress)) {
		errors.toAddress = 'Invalid address.';
	}

	new Array(MAX_METADATA_ATTRIBUTES).fill().forEach((value, index) => {
		const attrName = `attribute${index}`;
		const attrValue = `value${index}`;
		if (values[attrName] && values[attrName].length > 20) {
			errors[attrName] = 'Max is 20 chars.';
		}
		if (values[attrValue] && values[attrValue].length > 20) {
			errors[attrValue] = 'Max is 20 chars.';
		}
	});

	return errors;
};

/**
 * Validate NFT transfer form
 *
 * @param values - The values of the form.
 * @returns An object with the key of toAddress and the value of 'Invalid address.'
 */
export const validateNftTransferForm = (values) => {
	let errors = {};

	if (!values.toAddress) {
		errors.toAddress = 'Required';
	}

	if (values.toAddress && !isValidPublicKey(values.toAddress)) {
		errors.toAddress = 'Invalid address.';
	}

	return errors;
};

const COMMON_ERROR_MESSAGE = {
	MORE_THAN_ZERO: (tokenSymbol) => `Amount must be more than 0 ${tokenSymbol}.`,
	NOT_ENOUGH_BALANCE: 'Insufficient balance to complete the transaction. Please add funds to your account and try again.',
	NOT_ENOUGH_STAKED_AMOUNT: 'Not enough staked amount.',
	LESS_THAN_MIN_AMOUNT: (minAmount, tokenSymbol) =>
		`Please note that the minimum amount for your staking is ${minAmount} ${tokenSymbol} or more. Please adjust your amount and try again.`,
};

/**
 * If the send amount is less than the minimum amount, return an error message.
 * If the send amount is zero, return an error message.
 * If the send amount is more than the balance, return an error message.
 * If the token symbol is CSPR and the send amount plus the transfer fee is more than the balance,
 * return an error message. Otherwise, return an empty string
 * @returns The error message if the send amount is invalid.
 */
const getSendAmountError = ({ sendAmount, minAmount, tokenSymbol, displayBalance, transferFee }) => {
	if (minAmount && sendAmount < minAmount) {
		return `Amount must be at least ${minAmount} ${tokenSymbol}.`;
	}
	if (sendAmount <= 0) {
		return `Amount must be more than 0 ${tokenSymbol}.`;
	}
	if (sendAmount > displayBalance) {
		return 'Not enough balance.';
	}
	if (tokenSymbol === 'CSPR' && sendAmount + transferFee > displayBalance) {
		return 'Not enough balance.';
	}
	return '';
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
		errors.toAddress = 'Required.';
	}
	if (toAddress && !isValidPublicKey(toAddress)) {
		errors.toAddress = 'Invalid address.';
	}
	// send amount
	const sendAmountError = getSendAmountError({ sendAmount, minAmount, tokenSymbol, displayBalance, transferFee });
	if (sendAmountError) {
		errors.sendAmount = sendAmountError;
	}
	//cspr balance
	if (csprBalance < transferFee) {
		errors.transferFee = 'Not enough CSPR balance.';
	}
	return errors;
};

/**
 * Validate stake form
 * @param {object} stake
 */
export const validateStakeForm = ({ amount, tokenSymbol, balance, fee, minAmount, selectedValidator }) => {
	let errors = {};
	if (amount <= 0) {
		errors.amount = COMMON_ERROR_MESSAGE.MORE_THAN_ZERO(tokenSymbol);
	} else if (amount + fee > balance) {
		errors.amount = COMMON_ERROR_MESSAGE.NOT_ENOUGH_BALANCE;
	}

	if (!errors.amount && amount <= minAmount) {
		errors.amount = COMMON_ERROR_MESSAGE.LESS_THAN_MIN_AMOUNT(minAmount, tokenSymbol);
	}

	if (
		selectedValidator &&
		!selectedValidator.hasDelegated &&
		selectedValidator.isFullDelegator
	) {
		errors.validator = VALIDATOR_REACHED_MAXIMUM;
	}

	return errors;
};

/**
 * Validate undelegate form
 * @param {object} undelegate
 */
export const validateUndelegateForm = ({ amount, tokenSymbol, balance, fee, stakedAmount, minAmount }) => {
	let errors = {};
	if (amount <= 0) {
		errors.amount = COMMON_ERROR_MESSAGE.MORE_THAN_ZERO(tokenSymbol);
	} else if (amount > stakedAmount) {
		errors.amount = COMMON_ERROR_MESSAGE.NOT_ENOUGH_STAKED_AMOUNT;
	} else if (fee > balance) {
		errors.amount = COMMON_ERROR_MESSAGE.NOT_ENOUGH_BALANCE;
	}

	if (balance <= minAmount) {
		errors.amount = `Insufficient balance. System requires ${minAmount} ${tokenSymbol} minimum balance.`;
	}

	return errors;
};
