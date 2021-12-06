import { getPendingStakes, getConfirmedStakesGroupByValidator } from './stake';

jest.mock('@redux-requests/core', () => {
	return {
		getQuerySelector: jest.fn().mockReturnValue(() => ({ data: [{ decimals: { hex: 0x00 } }] })),
	};
});
test('get empty pending stakes', () => {
	const stakes = getPendingStakes()({
		stakes: {},
	});
	expect(stakes.length).toBe(0);
});

test('get pending stakes', () => {
	const stakes = getPendingStakes()({
		stakes: {
			delegations: [
				{
					status: 'pending',
				},
				{
					status: 'completed',
				},
			],
		},
	});
	expect(stakes.length).toBe(1);
});

test('get empty confirmed stakes by validators', () => {
	const stakes = getConfirmedStakesGroupByValidator()({
		stakes: {},
	});
	expect(stakes.length).toBe(0);
});

test('get confirmed stakes', () => {
	const stakes = getConfirmedStakesGroupByValidator()({
		stakes: {
			delegations: [
				{
					validator: '0x11',
					status: 'pending',
					amount: 1000,
				},
				{
					validator: '0x11',
					status: 'completed',
					amount: 1000,
				},
				{
					validator: '0x11',
					status: 'completed',
					amount: 1000,
				},
			],
		},
	});

	expect(stakes.length).toBe(1);
	expect(stakes[0].pendingAmount).toBe(1000);
	expect(stakes[0].completedAmount).toBe(2000);
});
// test('getTokensAddressList should return default token address list', () => {
// 	expect(getTokensAddressList({ tokens: { address: ['test'] } })).toEqual([
// 		'43f01f0a9798e64837e7244eafd7b1e6462ebd2023336feb9505ae59c4af3bf8',
// 		'test',
// 	]);
// 	expect(getTokensAddressList({})).toEqual(['43f01f0a9798e64837e7244eafd7b1e6462ebd2023336feb9505ae59c4af3bf8']);
// });

// describe('getMassagedTokenData', () => {
// 	test('Should return empty array if no data', () => {
// 		getQuerySelector.mockReturnValue();
// 		expect(getMassagedTokenData()).toEqual([
// 			{
// 				balance: {
// 					displayValue: undefined,
// 				},
// 				decimals: {
// 					displayValue: 0,
// 					hex: 0,
// 				},
// 				total_supply: {
// 					displayValue: 0,
// 				},
// 			},
// 		]);
// 	});
// });
