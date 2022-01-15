import { switchTheme } from './settingActions';

test('switchTheme', () => {
	expect(switchTheme()).toEqual({
		type: 'SETTINGS.SWITCH_THEME',
		payload: { theme: undefined },
	});
});
