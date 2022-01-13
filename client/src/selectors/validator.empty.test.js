import { getValidators } from './validator';

jest.mock('@redux-requests/core', () => {
	return {
		getQuerySelector: jest.fn().mockReturnValue(() => ({})),
	};
});

test('get empty validators', () => {
	const validators = getValidators()();
	expect(validators.length).toBe(0);
});
