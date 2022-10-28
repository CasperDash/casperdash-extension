import settingsReducer from './settings';

describe('SettingReducers', () => {
	describe('When switch theme', () => {
		test('Should return new SWITCH_THEME  state', () => {
			expect(settingsReducer(undefined, { type: 'SETTINGS.SWITCH_THEME', payload: { theme: 'dark' } })).toEqual({
				theme: 'dark',
				autoLockTime: 5
			});
		});
		
		test('Should return current state', () => {
			expect(settingsReducer({ theme: '' }, { type: 'SETTINGS.TEST', payload: 'dark' })).toEqual({ theme: '' });
		});		
	});

	describe('When set auto lock time', () => {
		test('Should return lock time with 10 minutes', () => {
			expect(settingsReducer(undefined, { type: 'SETTINGS.SET_AUTO_LOCK_TIME', payload: { autoLockTime: 10 } })).toEqual({
				theme: '',
				autoLockTime: 10
			});
		});

		test('Should return default lock time with 5 minutes', () => {
			expect(settingsReducer(undefined, { type: 'SETTINGS.TEST', payload: { } })).toEqual({
				theme: '',
				autoLockTime: 5
			});
		});
	});
});