const { putDeploy, getDeploysStatus, getLatestBlockHash } = require('../services/CasperServices');
const { getDeploysByAccount } = require('../services/DeployService');

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
	getLatestBlockHash: async (req, res) => {
		try {
			const latestBlockHash = await getLatestBlockHash();
			res.json({ latestBlockHash });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
	getDeploys: async (req, res) => {
		try {
			const { params } = req;
			const { publicKey } = params;
			const deploys = await getDeploysByAccount(publicKey);
			console.log('Deploys', deploys[0].dataValues);
			res.json({ deploys: deploys.map((deploy) => deploy.dataValues) });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};
