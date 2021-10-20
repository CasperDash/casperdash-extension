import APP_CONFIGS from '../config';

let features;
try {
	features =
		typeof APP_CONFIGS.AVAILABLE_FEATURES === 'string'
			? JSON.parse(APP_CONFIGS.AVAILABLE_FEATURES)
			: APP_CONFIGS.AVAILABLE_FEATURES;
} catch (error) {
	features = undefined;
}

const getAvailableRoutes = (routes) =>
	routes.reduce((out, route) => {
		const conf = { [route]: `/${route}` };
		return !features || features.includes(route) ? { ...out, ...conf } : out;
	});

// Routes which have sidebar
export const mainRoutes = getAvailableRoutes(['dashboard', 'tokens', 'history', 'keyManager']);

// Routes which don't have sidebar
export const wrapperRoutes = getAvailableRoutes(['/', 'newwallet']);
