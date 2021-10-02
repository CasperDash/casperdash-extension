const _ = require('lodash');
const { getTokensBalanceByPublicKey, getListTokenInfo, getTokenInfo } = require('../services/TokenServices');

module.exports = {
	getTokens: async (req, res) => {
		try {
			const { tokenAddress, publicKey } = req.query;
			if (!tokenAddress) {
				res.json([]);
			}

			const balances = await getTokensBalanceByPublicKey(tokenAddress, publicKey);
			const tokensInfo = await getListTokenInfo(tokenAddress);
			res.json(_.merge(balances, tokensInfo).filter((token) => token.name));
		} catch (err) {
			res.json(err);
		}
	},
	getToken: async (req, res) => {
		try {
			const { tokenAddress } = req.params;
			const tokenInfo = await getTokenInfo(tokenAddress);
			res.json(tokenInfo);
		} catch (error) {
			res.json(err);
		}
	},
};
