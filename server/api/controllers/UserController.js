const { getAccountDetails } = require('../services/UserService');

module.exports = {
	get: async (req, res) => {
		const publicKey = req.params.publicKey;
		const accountDetails = await getAccountDetails(publicKey);
		res.json(accountDetails);
	},
};
