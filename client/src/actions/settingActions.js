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

export const updateAutoLockTime = (autoLockTime) => {
	return { type: SETTINGS.SET_AUTO_LOCK_TIME, payload: { autoLockTime } };
};

export const updateNetwork = (network) => {
	return { type: SETTINGS.SET_NETWORK, payload: { network } };
};
