import { getWeightByAccountHash } from './keyManager';

const MOCK_ASSOCIATED_KEYS = [
	{
		accountHash: '81726381238172',
		weight: 1,
	},
	{
		accountHash: '123123',
		weight: 2,
	},
	{
		accountHash: 'd12312312',
		weight: 3,
	},
];

test('getWeightByAccountHash', () => {
	expect(getWeightByAccountHash('81726381238172', MOCK_ASSOCIATED_KEYS)).toEqual(1);
	expect(getWeightByAccountHash('d12312312', MOCK_ASSOCIATED_KEYS)).toEqual(3);
});
