import { ONE_MINUTE } from '@cd/constants/time';
import settingsReducer from './settings';

describe('SettingReducers', () => {
	describe('When switch theme', () => {
		test('Should return new SWITCH_THEME  state', () => {
			expect(settingsReducer(undefined, { type: 'SETTINGS.SWITCH_THEME', payload: { theme: 'dark' } })).toEqual({
				theme: 'dark',
				autoLockTime: 5 * ONE_MINUTE
			});
		});
		
		test('Should return current state', () => {
			expect(settingsReducer({ theme: '' }, { type: 'SETTINGS.TEST', payload: 'dark' })).toEqual({ theme: '' });
		});		
	});

	describe('When set auto lock time', () => {
		test('Should return lock time with 10 minutes', () => {
			expect(settingsReducer(undefined, { type: 'SETTINGS.SET_AUTO_LOCK_TIME', payload: { autoLockTime: 10 * ONE_MINUTE } })).toEqual({
				theme: '',
				autoLockTime: 10 * ONE_MINUTE
			});
		});

		test('Should return default lock time with 5 minutes', () => {
			expect(settingsReducer(undefined, { type: 'SETTINGS.TEST', payload: { } })).toEqual({
				theme: '',
				autoLockTime: 5 * ONE_MINUTE
			});
		});
	});
});