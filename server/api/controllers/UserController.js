const {
	getAccountBalance,
	getStateRootHash,
	getAccountBalanceByUref,
	getAccount,
} = require('../services/CasperServices');
const MOTES_RATE = 100000000;
module.exports = {
	get: (req, res) => {
		const test = { test: 'test' };
		res.json(test);
	},
	detail: async (req, res) => {
		const publicKey = req.params.publicKey;
		const account = await getAccount(publicKey);
		res.json({ account });
	},
	balanceByUref: async (req, res) => {
		const balanceUref = req.params.balanceUref;
		const balance = await getAccountBalanceByUref(balanceUref);

		res.json({ balanceUref, balance: parseFloat(balance / MOTES_RATE).toFixed(2) });
	},
};
