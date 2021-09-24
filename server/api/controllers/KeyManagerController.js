const {
	getKeyManagerInfoByPublicKey,
	getKeyManagerDeploy,
	deployKeyManagerContract,
} = require('../services/KeyManagerServices');

module.exports = {
	get: async (req, res) => {
		const { publicKey } = req.params;
		try {
			const keyManagerInfo = await getKeyManagerInfoByPublicKey(publicKey);
			res.json(keyManagerInfo);
		} catch (error) {
			res.status(401).json({ message: error.message });
		}
	},
	getKeyManagerContractDeploy: async (req, res) => {
		try {
			res.json(await getKeyManagerDeploy());
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
	deployKeyManagerContract: async (req, res) => {
		try {
			const body = req.body;
			const hash = await deployKeyManagerContract(body);
			res.json({ deployHash: hash });
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};
