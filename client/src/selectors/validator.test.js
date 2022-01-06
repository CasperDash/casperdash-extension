import { getQuerySelector } from '@redux-requests/core';
import { validatorSelector, getValidators } from './validator';

jest.mock('@redux-requests/core', () => {
	return {
		getQuerySelector: jest.fn().mockReturnValue(() => ({
			data: [
				{
					validator: '0x00',
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
	const validators = getValidators()();
	expect(validators.length).toBe(1);
});
