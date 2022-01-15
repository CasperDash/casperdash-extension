const EXTENSION_HOME_URL = 'home.html';

/**
 * open new tab
 * @param {object} options new tab options
 */
export const newTab = (options) => {
	const { route, url = EXTENSION_HOME_URL } = options;
	let extensionURL = chrome.runtime.getURL(url);
	if (route) {
		extensionURL += `#${route}`;
	}
	chrome.tabs.create({
		url: extensionURL,
	});
};

export const isPopupMode = () => {
	return window.location.href.includes('popup.html');
};
