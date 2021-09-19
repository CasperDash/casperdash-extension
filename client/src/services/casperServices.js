import {
	CasperClient,
	CasperServiceByJsonRPC,
	PublicKey,
	Keys,
	RuntimeArgs,
	DeployUtil,
	AccountHash,
	KeyValue,
	CLTypedAndToBytesHelper,
	CLValueBuilder,
} from 'casper-js-sdk';

const NETWORK_NAME = 'casper-test';
const PAYMENT_AMOUNT = 100000000000;
const TESTNET_RPC_URL = 'http://16.162.124.124:7777/rpc';

export const client = new CasperClient(TESTNET_RPC_URL);

// Builds key-manager deploy that takes entrypoint and args
const buildKeyManagerDeploy = (baseAccount, entrypoint, args) => {
	const deployParams = new DeployUtil.DeployParams(baseAccount, NETWORK_NAME);
	const runtimeArgs = RuntimeArgs.fromMap(args);
	const sessionModule = DeployUtil.ExecutableDeployItem.newStoredContractByName(
		'keys_manager',
		entrypoint,
		runtimeArgs,
	);
	const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT);
	return DeployUtil.makeDeploy(deployParams, sessionModule, payment);
};

// Sets key with a specified weight
export const setKeyWeightDeploy = (fromAccount, account, weight) => {
	return buildKeyManagerDeploy(fromAccount, 'set_key_weight', {
		account: account,
		weight: CLValueBuilder.u8(weight),
	});
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper method for geting a deploy in a defined time period (30s)
async function getDeploy(deployHash) {
	let i = 300;
	while (i !== 0) {
		const [deploy, raw] = await client.getDeploy(deployHash);
		if (raw.execution_results.length !== 0) {
			if (raw.execution_results[0].result.Success) {
				return deploy;
			} else {
				throw Error('Contract execution: ' + raw.execution_results[0].result.Failure.error_message);
			}
		} else {
			i--;
			await sleep(1000);
			continue;
		}
	}
	throw Error('Timeout after ' + i + "s. Something's wrong");
}

// Helper method for printing deploy result
const printDeploy = async (deployHash) => {
	console.log('Deploy hash: ' + deployHash);
	console.log('Deploy result:');
	console.log(DeployUtil.deployToJson(await getDeploy(deployHash)));
};

// Helper method for getting the current state of the account
const getAccount = async (publicKey) => {
	const c = new CasperServiceByJsonRPC(TESTNET_RPC_URL);
	const stateRootHash = (await c.getLatestBlockInfo()).block.header.state_root_hash;
	const account = await c.getBlockState(stateRootHash, publicKey.toAccountHashStr(), []).then((res) => res.Account);
	return account;
};

// Helper method for printing account info
export const printAccount = async (account) => {
	console.log('\n[x] Current state of the account:');
	console.log(JSON.parse(JSON.stringify(await getAccount(account.publicKey), null, 2)));
};

// Helper method for sending deploy and displaying signing keys
export const sendDeploy = async (deploy, signingKeys) => {
	for (let key of signingKeys) {
		console.log(`Signed by: ${key.publicKey.toAccountHashStr()}`);
		deploy = client.signDeploy(deploy, key);
	}
	const deployHash = await client.putDeploy(deploy);
	await printDeploy(deployHash);
};

export const putDeploy = async (deploy) => {
	const deployHash = await client.putDeploy(deploy);
	await printDeploy(deployHash);
	return deployHash;
};

export const getTransferDeploy = (fromAccount, toAccount, amount) => {
	const deployParams = new DeployUtil.DeployParams(fromAccount, NETWORK_NAME);
	const transferParams = DeployUtil.ExecutableDeployItem.newTransfer(amount, toAccount, null, 1);
	const payment = DeployUtil.standardPayment(PAYMENT_AMOUNT);
	return DeployUtil.makeDeploy(deployParams, transferParams, payment);
};
