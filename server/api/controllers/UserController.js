const { getAccountDetails } = require('../services/UserService');

module.exports = {
	get: async (req, res) => {
		try {
			const publicKey = req.params.publicKey;
			const accountDetails = await getAccountDetails(publicKey);
			res.json(accountDetails);
		} catch {
			res.json({});
		}
	},
};
