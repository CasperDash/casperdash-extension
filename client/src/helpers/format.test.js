import {
	toFormattedNumber,
	toFormattedCurrency,
	toFormattedDate,
	displayNaN,
	getEndString,
	toDisplayValueFromMote,
	getValueByFormat,
} from './format';

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

describe('displayNaN', () => {
	test('Should return number if valid number', () => {
		expect(displayNaN(10)).toEqual(10);
	});
	test('Should return - if NaN number', () => {
		expect(displayNaN(NaN)).toEqual('-');
	});
});

describe('getEndString', () => {
	test('Should return input value if not a string', () => {
		expect(getEndString({}, 1)).toEqual({});
	});
	test('Should return end string if end is string', () => {
		expect(getEndString('test', 'test')).toEqual('test');
	});
	test('Should return substring by end param', () => {
		expect(getEndString('test123123', 2)).toEqual('23');
	});
	test('Should return substring by regex', () => {
		expect(getEndString('test123123', /2/i)).toEqual('23123');
	});
	test('Should return empty string if no match with regex', () => {
		expect(getEndString('test123123', /222123123/i)).toEqual('');
	});
});

describe('getValueByFormat', () => {
	test('Should return input value if not a string', () => {
		expect(getEndString('test', {})).toEqual(undefined);
	});
	test('Should return end string if end is string', () => {
		expect(getEndString('test', 'test')).toEqual('test');
	});
	test('Should return substring by end param', () => {
		expect(getEndString('test123123', 2)).toEqual('23');
	});
	test('Should return substring by regex', () => {
		expect(getEndString('test123123', /2/i)).toEqual('23123');
	});
	test('Should return empty string if no match with regex', () => {
		expect(getEndString('test123123', /222123123/i)).toEqual('');
	});
});

describe('toDisplayValueFromMote', () => {
	test('toDisplayValueFromMote', () => {
		expect(toDisplayValueFromMote(10000000000).toString()).toEqual('10');
	});
});

describe('getValueByFormat', () => {
	test('should return currency format', () => {
		expect(getValueByFormat(100, { format: 'currency' }).toString()).toEqual('$100.00');
	});
	test('should return number format', () => {
		expect(getValueByFormat(100, { format: 'number' }).toString()).toEqual('100');
	});
	test('should return mote format', () => {
		expect(getValueByFormat(10000000000, { format: 'mote' }).toString()).toEqual('10');
	});
	test('should return percentage format', () => {
		expect(getValueByFormat(10, { format: 'percentage' }).toString()).toEqual('10.00%');
	});
	test('should return input value if no match format', () => {
		expect(getValueByFormat(10, { format: 'test' }).toString()).toEqual('10');
	});
});
