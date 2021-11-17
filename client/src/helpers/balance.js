import { MOTE_RATE } from '../constants/key';

export const convertBalanceFromHex = (balanceHex) => {
	const balance = parseInt(balanceHex);
	return moteToCspr(balance);
};

export const moteToCspr = (balanceInCSPR) => {
	return parseFloat(balanceInCSPR / MOTE_RATE);
};
