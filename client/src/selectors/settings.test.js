import { getTheme } from './settings';

test('Should return current theme', () => {
	expect(getTheme({ settings: { theme: 'dark' } })).toEqual('dark');
});
