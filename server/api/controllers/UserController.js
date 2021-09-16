const { getAccountBalance, getStateRootHash } = require('../services/CasperServices');
module.exports = {
	get: (req, res) => {
		const test = { test: 'test' };
		res.json(test);
	},
	detail: async (req, res) => {
		const publicKey = req.params.publicKey;
		const balance = await getAccountBalance(publicKey);
		const rootHash = await getStateRootHash();
		res.json({ publicKey, balance, ...rootHash });
	},
};
