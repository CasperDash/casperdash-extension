import { getQuerySelector } from '@redux-requests/core';
import { validatorSelector, getValidators } from './validator';

jest.mock('@redux-requests/core', () => {
	return {
		getQuerySelector: jest.fn().mockReturnValue(() => ({
			data: [
				{
					public_key: '0x00',
				},
			],
		})),
	};
});

test('userDetailsSelector should call getQuerySelector ', () => {
	validatorSelector;
	expect(getQuerySelector).toHaveBeenCalledWith({
		type: 'VALIDATORS.FETCH_ACTIVE_VALIDATORS',
	});
});

test('get validators', () => {
	getQuerySelector.mockReturnValue(() => ({
		data: [
			{
				public_key: '0x00',
			},
		],
	}));
	const validators = getValidators()();
	expect(validators.length).toBe(1);
});

test('get validators with search tem', () => {
	const validators = getValidators('0x00')();
	expect(validators.length).toBe(1);
});
