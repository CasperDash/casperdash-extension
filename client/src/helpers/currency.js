import { BigNumber } from '@ethersproject/bignumber';
import { MOTE_RATE } from '../constants/key';
import Big from 'big.js';

export const toMotes = (amount) => {
	const bigAmount = Big(amount).times(MOTE_RATE).round(0, Big.roundDown).toString();
	return BigNumber.from(bigAmount);
};
