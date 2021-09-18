const { MOTE_RATE, TESTNET_RPC_URL } = require('../../constants');

module.exports = {
	get: async (req, res) => {
		res.json({ MOTE_RATE, TESTNET_RPC_URL });
	},
};
