import { BigNumber } from '@ethersproject/bignumber';
import { MOTE_RATE } from '../constants/key';
import Big from 'big.js';

export const toMotes = (amount) => {
	const bigAmount = Big(amount).times(MOTE_RATE).round(0, Big.roundDown).toString();
	return BigNumber.from(bigAmount);
};

export const fromMotes = (amount) => {
	return Big(amount).div(MOTE_RATE).toString();
};

export const csprToString = (amount) => {
	try {
		return Big(amount).round(9, Big.roundDown).toString();
	} catch (error) {
		return '-';
	}
};
