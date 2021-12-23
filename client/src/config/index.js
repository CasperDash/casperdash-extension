const CONFIG_OPTIONS = {
	PORT: {
		env: 'PORT',
		default: '3000',
	},
	APP_ROOT: {
		env: 'APP_ROOT',
		default: 'http://localhost:3000/',
	},
	API_ROOT: {
		env: 'REACT_APP_API_ROOT',
		default: 'https://testnet.casperdash.io',
	},
	FAILED_LOGIN_ATTEMPTS_TO_BLOCK: {
		env: 'FAILED_LOGIN_ATTEMPTS_TO_BLOCK',
		default: '10',
	},
	APP_ENVIRONMENT: {
		env: 'APP_ENVIRONMENT',
		default: 'local',
	},
	NETWORK_NAME: {
		env: 'REACT_APP_NETWORK_NAME',
		default: 'casper-test',
	},
	AVAILABLE_FEATURES: {
		env: 'REACT_APP_AVAILABLE_FEATURES',
		default: undefined,
	},
	AUCTION_HASH: {
		env: 'REACT_APP_AUCTION_HASH',
		default: '93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2', //testnet auction contract hash.
	},
	EXPLORER_ROOT_LINK: {
		env: 'REACT_APP_EXPLORER_ROOT_LINK',
		default: 'https://testnet.cspr.live',
	},
};

const getConfigOption = (option) => {
	const item = CONFIG_OPTIONS[option];

	if (!item) {
		return null;
	}

	if (Object.prototype.hasOwnProperty.call(process.env, item.env)) {
		return process.env[item.env];
	}

	return item.default;
};

module.exports = Object.keys(CONFIG_OPTIONS).reduce((result, field) => {
	result[field] = getConfigOption(field);
	return result;
}, {});
