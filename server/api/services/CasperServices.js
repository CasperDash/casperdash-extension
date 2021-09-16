const { CasperServiceByJsonRPC, CasperClient, CLPublicKey } = require('casper-js-sdk');

const RPC_URL = 'https://node-clarity-testnet.make.services/rpc';
const MAINNET_RPC_URL = 'http://localhost:11101/rpc';
const casperClient = new CasperClient(MAINNET_RPC_URL);
const casperServiceRPC = new CasperServiceByJsonRPC(MAINNET_RPC_URL);

const getBlockInfo = async () => {
	const info = await casperServiceRPC.getStatus();
	return info;
};

const getStateRootHash = async () => {
	const latestBlockInfo = await casperServiceRPC.getLatestBlockInfo();
	const stateRootHash = await casperServiceRPC.getStateRootHash(latestBlockInfo.block.hash);
	return { latestBlockInfo, stateRootHash };
};

const getAccountBalance = async (publicKey) => {
	try {
		const publicKeyCL = CLPublicKey.fromHex(publicKey);
		// const stateRootHash = await getStateRootHash();
		// const balance = await casperServiceRPC.getAccountBalanceUrefByPublicKey(stateRootHash, publicKeyCL);
		const balance = await casperClient.balanceOfByAccountHash(publicKeyCL.toAccountHash());
		console.log('balance', balance);
		return balance;
	} catch {
		return 0;
	}
};

module.exports = {
	getAccountBalance,
	getStateRootHash,
};
