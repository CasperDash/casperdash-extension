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
	routes.reduce((out, { name, route }) => {
		const conf = { [name]: route };
		return !features || features.includes(route) ? { ...out, ...conf } : out;
	});

// Routes which have sidebar
export const mainRoutes = getAvailableRoutes([
	{ name: 'dashboard', route: '/dashboard' },
	{ name: 'tokens', route: '/tokens' },
	{ name: 'history', route: '/history' },
	{ name: 'keyManager', route: '/keyManager' },
]);

// Routes which don't have sidebar
export const wrapperRoutes = getAvailableRoutes([
	{ name: 'home', route: '/' },
	{ name: 'newwallet', route: '/newwallet/:mode' },
]);
