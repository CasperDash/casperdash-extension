const { putDeploy, getDeploysStatus, getLatestBlockHash } = require('../services/CasperServices');
const { getDeployTransactionsByAccount } = require('../services/DeployService');

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
	getTransfers: async (req, res) => {
		try {
			const { params } = req;
			const { publicKey } = params;
			const deploys = await getDeployTransactionsByAccount(publicKey);
			const result = [];
			// TODO: improvement the Big O
			deploys.forEach((deploy) => {
				const { transfers, effect } = deploy.execution_result.Success;
				const { transforms } = effect;
				transfers.forEach((t) => {
					const transfer = transforms.find((transform) => transform.key === t);
					const writeTransfer =
						transfer && transfer.transform.WriteTransfer ? transfer.transform.WriteTransfer : {};
					result.push(writeTransfer);
				});
			});
			res.json(result);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};
