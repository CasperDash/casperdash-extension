import { getLocalStorageValue } from '../../services/localStorage';
import stakesReducer from './stakes';
jest.mock('../../services/localStorage', () => {
	return {
		__esModule: true,
		getLocalStorageValue: jest.fn(),
		getNetworkStorageKey: jest.fn().mockReturnValue('casper-test'),
	};
});

test('Should return new PUSH_STAKE_TO_LOCAL_STORAGE stake state', () => {
	expect(
		stakesReducer(undefined, { type: 'STAKE.PUSH_STAKE_TO_LOCAL_STORAGE', payload: [{ validator: '0x11' }] }),
	).toEqual({
		delegations: [
			[
				{
					validator: '0x11',
				},
			],
		],
	});
});

test('Should return new GET_STAKES_FROM_LOCAL_STORAGE stake state', () => {
	getLocalStorageValue.mockReturnValue([
		{
			validator: '0x123',
		},
	]);
	expect(
		stakesReducer(
			{ delegations: [] },
			{ type: 'STAKE.GET_STAKE_FROM_LOCAL_STORAGE', payload: { publicKey: 'test', network: 'casper-test' } },
		),
	).toEqual({
		delegations: [
			{
				validator: '0x123',
			},
		],
	});

	expect(getLocalStorageValue).toHaveBeenCalledWith('test', 'casper-test');
});

test('Should update stakes local storage', () => {
	expect(
		stakesReducer(
			{ delegations: [] },
			{
				type: 'STAKE.UPDATE_STAKES_LOCAL_STORAGE',
				payload: [
					{
						validator: '0x123',
					},
				],
			},
		),
	).toEqual({
		delegations: [
			{
				validator: '0x123',
			},
		],
	});
});

test('default', () => {
	expect(stakesReducer({ delegations: [] }, { type: '' })).toEqual({ delegations: [] });
});
