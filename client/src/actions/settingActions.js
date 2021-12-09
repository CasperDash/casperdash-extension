import { SETTINGS } from '../store/actionTypes';

/**
 * @param {string} theme
 * @returns {object}
 */
export const switchTheme = (theme) => {
	const currentTheme = localStorage.getItem('themColor');
	if (typeof window !== 'undefined' && theme !== currentTheme) {
		localStorage.setItem('themColor', theme);
	}
	return { type: SETTINGS.SWITCH_THEME, payload: { theme } };
};
