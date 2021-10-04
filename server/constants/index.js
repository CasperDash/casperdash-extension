const MOTE_RATE = 1000000000;
const TESTNET_RPC_URL = process.env.TESTNET_RPC_URL || 'http://144.76.97.151:7777/rpc';
const ERC20_TOKEN_ATTRS = ['name', 'symbol', 'total_supply', 'decimals'];

module.exports = {
	MOTE_RATE,
	TESTNET_RPC_URL,
	ERC20_TOKEN_ATTRS,
};
