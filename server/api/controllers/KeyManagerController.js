const { getKeyManagerInfoByPublicKey } = require('../services/KeyManagerServices');

module.exports = {
	get: async (req, res) => {
		const { publicKey } = req.params;
		try {
			const keyManagerInfo = await getKeyManagerInfoByPublicKey(publicKey);
			res.json(keyManagerInfo);
		} catch (error) {
			res.json(error);
		}
	},
};
