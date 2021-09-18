import { MOTE_RATE } from '../constants/key';

export const convertBalanceFromHex = (balanceHex) => {
	const balance = parseInt(balanceHex);
	return parseFloat(balance / MOTE_RATE);
};
