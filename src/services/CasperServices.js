import { CasperServiceByJsonRPC, CasperClient, Signer } from 'casper-js-sdk';

const RPC_URL = 'https://node-clarity-testnet.make.services/rpc';
const MAINNET_RPC_URL = 'https://node-clarity-mainnet.make.services/rpc';
const casperClient = new CasperClient(MAINNET_RPC_URL);
const casperServiceRPC = new CasperServiceByJsonRPC(RPC_URL);

export const getBlockInfo = async () => {
	const info = await casperServiceRPC.getStatus();
	return info;
};

export const getAccountBalance = async () => {
	const publicKey = await Signer.getActivePublicKey();

	const balance = await casperClient.balanceOfByAccountHash(publicKey);

	return `${parseInt(balance._hex, 16)} - ${publicKey}`;
};
