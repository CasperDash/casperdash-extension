const _ = require('lodash');
const { getTokensBalanceByPublicKey, getListTokenInfo } = require('../services/TokenServices');

module.exports = {
	getTokens: async (req, res) => {
		try {
			const { tokenAddress, publicKey } = req.query;
			if (!tokenAddress) {
				res.json([]);
			}

			const balances = await getTokensBalanceByPublicKey(tokenAddress, publicKey);
			const tokenInfo = await getListTokenInfo(tokenAddress);

			res.json(_.merge(balances, tokenInfo));
		} catch (err) {
			res.json(err);
		}
	},
};
