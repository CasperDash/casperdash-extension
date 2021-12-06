import { toMotes } from './currency';

describe('toMotes', () => {
	test('can convert cspr to mote with valid string number', () => {
		expect(toMotes('10').toNumber()).toEqual(10000000000);
	});

	test('can convert cspr to mote with floating number string having less than 9 decimal places', () => {
		expect(toMotes('1.123456789').toNumber()).toEqual(1123456789);
	});

	test('can covert cspr to rounded mote with floating number string having more than 9 decimal places', () => {
		expect(toMotes('10.123456789123').toNumber()).toEqual(10123456789);
	});

	test('can not covert cspr to mote with string', () => {
		expect(toMotes('casperdash')).toEqual('-');
	});
});
