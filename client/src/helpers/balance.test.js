import { convertBalanceFromHex } from './balance';
const MOTE_RATE = 1000000000;

test.each([0x000186a0, 0x2540be400])('Return balance in float', (balance) => {
	expect(convertBalanceFromHex(balance)).toEqual(balance / MOTE_RATE);
});
