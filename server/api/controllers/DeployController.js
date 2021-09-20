const { putDeploy } = require('../services/CasperServices');

module.exports = {
	deploy: async (req, res) => {
		const body = req.body;
		const hash = await putDeploy(body);
		res.json({ deployHash: hash });
	},
};
