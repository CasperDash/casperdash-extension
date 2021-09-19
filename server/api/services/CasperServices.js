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

const putDeploy = async (deployJson) => {
	const deploy = DeployUtil.deployFromJson(deployJson);
	console.log(deploy);
	const hash = await casperClient.putDeploy(deploy.val);
	return hash;
};

module.exports = {
	getStateRootHash,
	casperServiceRPC,
	putDeploy,
};
