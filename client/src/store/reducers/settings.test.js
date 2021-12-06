import settingsReducer from './settings';

test('Should return new SWITCH_THEME  state', () => {
	expect(settingsReducer(undefined, { type: 'SETTINGS.SWITCH_THEME', payload: { theme: 'dark' } })).toEqual({
		theme: 'dark',
	});
});

test('Should return current state', () => {
	expect(settingsReducer({ theme: '' }, { type: 'SETTINGS.TEST', payload: 'dark' })).toEqual({ theme: '' });
});
