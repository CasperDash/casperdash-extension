import { toFormattedNumber, toFormattedCurrency, toFormattedDate } from './format';

test('toFormattedNumber', () => {
	expect(toFormattedNumber(10)).toEqual('10');
	expect(toFormattedNumber(10.9999)).toEqual('10.9999');
	expect(toFormattedNumber(10.9999999999)).toEqual('11');
	expect(toFormattedNumber(10000, 'ja-JP')).toEqual('10,000');
	expect(toFormattedNumber(10.6666, { maximumSignificantDigits: 3 })).toEqual('10.7');
});

test('toFormattedCurrency', () => {
	expect(toFormattedCurrency(10)).toEqual('$10.00');
	expect(toFormattedCurrency(10000, 'ja-JP')).toEqual('$10,000.00');
	expect(toFormattedCurrency(10000, { currency: 'JPY' })).toEqual('¥10,000');
});

describe('toFormattedDate', () => {
	test('valid date', () => {
		expect(toFormattedDate('10-10-2021 01:00:00', undefined, 'en-US')).toEqual('10/10/21, 01:00:00');
	});
});
