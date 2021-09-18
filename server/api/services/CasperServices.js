const { CasperServiceByJsonRPC, CasperClient, CLPublicKey } = require('casper-js-sdk');

const RPC_URL = 'https://node-clarity-testnet.make.services/rpc';
const TESTNET_RPC_URL = 'http://16.162.124.124:7777/rpc';
const casperServiceRPC = new CasperServiceByJsonRPC(TESTNET_RPC_URL);

const getStateRootHash = async () => {
	const latestBlockInfo = await casperServiceRPC.getLatestBlockInfo();
	const stateRootHash = await casperServiceRPC.getStateRootHash(latestBlockInfo.block.hash);
	return stateRootHash;
};

module.exports = {
	getStateRootHash,
	casperServiceRPC,
};
