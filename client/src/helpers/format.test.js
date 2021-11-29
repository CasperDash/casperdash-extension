import { toFormattedNumber, toFormattedCurrency, toFormattedDate } from './format';

test('toFormattedNumber', () => {
	expect(toFormattedNumber(10)).toEqual('10');
	expect(toFormattedNumber(10.999999999)).toEqual('10.999999999');
	expect(toFormattedNumber(10.9999999999)).toEqual('11');
	expect(toFormattedNumber(10000, 'ja-JP')).toEqual('10,000');
	expect(toFormattedNumber(10.6666, undefined, { maximumSignificantDigits: 3 })).toEqual('10.7');
});

test('toFormattedCurrency', () => {
	expect(toFormattedCurrency(10)).toEqual('$10.00');
	expect(toFormattedCurrency(10000, 'ja-JP')).toEqual('$10,000.00');
	expect(toFormattedCurrency(10000, undefined, { currency: 'JPY' })).toEqual('¥10,000');
});

describe('toFormattedDate', () => {
	test('valid date', () => {
		expect(toFormattedDate('10-10-2021', 'ja-JP')).toEqual('2021/10/10 0:00:00');
	});
	test('invalid date', () => {
		const mockDate = new Date('10-10-2021 01:00');
		global.Date = jest.fn().mockImplementation(() => mockDate);
		expect(toFormattedDate('test', 'en-US')).toEqual('10/10/21, 01:00:00');
	});
});
