const { putDeploy, getDeploysStatus } = require('../services/CasperServices');

module.exports = {
	deploy: async (req, res) => {
		const body = req.body;
		const hash = await putDeploy(body);
		res.json({ deployHash: hash });
	},
	getDeploysStatus: async (req, res) => {
		try {
			const query = req.query;
			const deploys = await getDeploysStatus(query.deployHash);
			res.json(deploys);
		} catch (error) {
			console.log('error');
			res.status(500).json({ message: error.message });
		}
	},
};
