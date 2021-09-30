const { CasperServiceByJsonRPC, CasperClient, CLPublicKey, DeployUtil } = require('casper-js-sdk');

const RPC_URL = 'https://node-clarity-testnet.make.services/rpc';
const TESTNET_RPC_URL = 'http://16.162.124.124:7777/rpc';
const casperServiceRPC = new CasperServiceByJsonRPC(TESTNET_RPC_URL);
const casperClient = new CasperClient(TESTNET_RPC_URL);

const getStateRootHash = async () => {
	const latestBlockInfo = await casperServiceRPC.getLatestBlockInfo();
	const stateRootHash = await casperServiceRPC.getStateRootHash(latestBlockInfo.block.hash);
	return stateRootHash;
};

const getLatestBlockHash = async () => {
	const latestBlockInfo = await casperServiceRPC.getLatestBlockInfo();
	return latestBlockInfo.block.hash;
};

const putDeploy = async (deployJson) => {
	try {
		console.log('deployJson', deployJson);
		const deploy = DeployUtil.deployFromJson(deployJson);
		console.log(deploy);
		const hash = await casperClient.putDeploy(deploy.val);
		return hash;
	} catch (error) {
		console.log(error);
	}
};

const getDeployResultJson = async (deployHash) => {
	const deploy = await casperClient.getDeploy(deployHash);

	return deploy[1];
};

const getDeployJson = async (deployHash) => {
	const deploy = await casperClient.getDeploy(deployHash);
	const jsonDeploy = DeployUtil.deployToJson(deploy[0]);

	return jsonDeploy;
};

const getDeploysResult = async (deployHash) => {
	const hashes = Array.isArray(deployHash) ? deployHash : [deployHash];
	const deploys = await Promise.all(
		hashes.map(async (hash) => {
			const deployJson = await getDeployResultJson(hash);
			return deployJson;
		}),
	);
	console.log(deploys);
	return deploys;
};

const getDeploysStatus = async (deployHash) => {
	const deploysResult = await getDeploysResult(deployHash);
	return deploysResult.length
		? deploysResult.map((result) => {
				const { execution_results, deploy } = result;
				return {
					hash: deploy.hash,
					status: !execution_results.length
						? 'pending'
						: execution_results.some((rs) => rs.result.Failure)
						? 'fail'
						: 'success',
				};
		  })
		: [];
};

/**
 * Returns value of a key associated with global storage.
 * @param {String} stateRootHash - Root hash of global state at a recent block.
 * @param {String} stateKey - Key of an item within global state.
 * @param {String} statePath - Path of data associated with a key within a global state.
 * @return {Object} On-chain account information.
 */
const getStateKeyValue = async (stateRootHash, stateKey, statePath) => {
	// Chain query: get global state key value.
	const {
		CLValue: { data: value },
	} = await casperClient.nodeClient.getBlockState(stateRootHash, stateKey, [statePath]);

	return value;
};

module.exports = {
	getStateRootHash,
	casperServiceRPC,
	putDeploy,
	getDeployJson,
	getDeploysResult,
	getDeploysStatus,
	getLatestBlockHash,
	getStateKeyValue,
};
