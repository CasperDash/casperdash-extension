// Routes which don't have sidebar
export const mainRoutes = {
	dashboard: '/dashboard',
	tokens: '/tokens',
	history: '/history',
	keyManager: '/keyManager',
};

// Routes which have sidebar
export const wrapperRoutes = {
	home: '/',
	login: '/login',
	newwallet: '/newwallet/:mode',
};

export const publicRoutes = {
	connector: '/connector',
};
