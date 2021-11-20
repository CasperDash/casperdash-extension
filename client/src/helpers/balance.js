import { MOTE_RATE } from '../constants/key';

/**
 * Convert mote balance from hex to display balance.
 * @param {String} balanceHex - Balance hex.
 * @return {Float} Balance in float.
 */
export const convertBalanceFromHex = (balanceHex) => {
	const balance = parseInt(balanceHex);
	return parseFloat(balance / MOTE_RATE);
};
