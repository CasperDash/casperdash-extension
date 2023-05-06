const CONFIG_OPTIONS = {
	API_ROOT: {
		env: 'REACT_APP_API_ROOT',
		default: 'http://localhost:3001/',
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
	SWAP_FM_API_ROOT: {
		env: 'REACT_APP_SWAP_FM_API_ROOT',
		default: 'https://api.friendly.market/api/v1',
	},
	SWAP_FM_TOKEN_API: {
		env: 'REACT_APP_SWAP_FM_TOKEN_API',
		default: 'https://raw.githubusercontent.com/FriendlyMarket/token-list/main/tokenlist.json', 
	},
	SWAP_FM_MODULE_BYTES_API: {
		env: 'REACT_APP_SWAP_FM_MODULE_BYTES_API',
		default: 'https://assets.casperdash.io/sc-resources/gistfile1.txt',
	},
	SWAP_FM_CONTRACT_HASH: {
		env: 'REACT_APP_SWAP_FM_CONTRACT_HASH',
		default: 'fa64806972777d6263dea1f0e5a908620ffd19113df57ebd9ea4aa4e23de6090',
	},
	SWAP_FM_SPENDER_PACKAGE_HASH: {
		env: 'REACT_APP_SWAP_FM_SPENDER_PACKAGE_HASH',
		default: 'hash-460018b5a6a6fa6046d1021a7f4414fd45e5e506e6604b4656fe66c90b661e6b',
	}
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
