import { CLPublicKey, DeployUtil, CLValueBuilder, RuntimeArgs, CLKey } from 'casper-js-sdk';
import { getSwapModuleBytes, getLiquidityModuleBytes } from '@cd/apiServices/friendlyMarket/moduleBytes';
import { NETWORK_NAME, DEPLOY_TTL_MS } from '@cd/constants/key';
import { buildTransferTokenDeploy, contractHashToByteArray, createRecipientAddress } from './casperServices';
import { stringToCLKey } from './casperServices';


export const FUNCTIONS = {
	// CSPR -> TOKENS
    SWAP_EXACT_CSPR_FOR_TOKENS: 'swap_exact_cspr_for_tokens',
	// CSPR -> TOKENS
	SWAP_CSPR_FOR_EXACT_TOKENS: 'swap_cspr_for_exact_tokens',
	// TOKENS -> TOKENS
	SWAP_EXACT_TOKENS_FOR_TOKENS: 'swap_exact_tokens_for_tokens',
	// TOKENS -> TOKENS
    SWAP_TOKENS_FOR_EXACT_TOKENS: 'swap_tokens_for_exact_tokens',
	// TOKENS -> CSPR
	SWAP_EXACT_TOKENS_FOR_CSPR: 'swap_exact_tokens_for_cspr',
	// TOKENS -> CSPR
	SWAP_TOKENS_FOR_EXACT_CSPR: 'swap_tokens_for_exact_cspr',
	// Add Liquidity for CSPR
	ADD_LIQUIDITY_CSPR: 'add_liquidity_cspr',
	// Add Liquidity for Tokens
	ADD_LIQUIDITY: 'add_liquidity',
}

export const getGasFee = (entryPoint) => {
	switch(entryPoint) {
		case FUNCTIONS.SWAP_CSPR_FOR_EXACT_TOKENS:
		case FUNCTIONS.SWAP_TOKENS_FOR_EXACT_CSPR:
		case FUNCTIONS.SWAP_EXACT_TOKENS_FOR_CSPR:
			return 15885790080;
		case FUNCTIONS.SWAP_EXACT_CSPR_FOR_TOKENS:
		case FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS:
		case FUNCTIONS.SWAP_EXACT_TOKENS_FOR_TOKENS:
			return 13015790080;
		case FUNCTIONS.ADD_LIQUIDITY:
			return 12205790080;
		case FUNCTIONS.ADD_LIQUIDITY_CSPR:
			return 20000000000;
		default:
			return 20000000000;
	}
}


/**
 * It builds a transfer token deploy.
 * @param [transactionDetail] - {
 * @returns The transaction object.
 */
export const getTransferTokenDeploy = (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, contractInfo = {}, fee, network } = transactionDetail;
		const { address, decimals } = contractInfo;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		return buildTransferTokenDeploy(fromPbKey, toPbKey, amount * 10 ** decimals.hex, address, fee, network);
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get token transfer deploy.`);
	}
};

export const buildExactSwapCSPRForTokensDeploy = async (contractHash, transactionDetail = {}) => {
	const contractHashByteArray = contractHashToByteArray(contractHash);
	const fromPbKey = CLPublicKey.fromHex(transactionDetail.fromPublicKey);
	const toPbKey = CLPublicKey.fromHex(transactionDetail.toPublicKey);

	const mapping = {
		amount_in: CLValueBuilder.u256(transactionDetail.amountIn),
		amount_out_min: CLValueBuilder.u256(transactionDetail.amountOutMin),
		path: CLValueBuilder.list(transactionDetail.path.map((token) => CLValueBuilder.string(token))),
		to: createRecipientAddress(toPbKey),
		deadline: CLValueBuilder.u64(transactionDetail.deadline),
		contract_hash_key: new CLKey(CLValueBuilder.byteArray(contractHashByteArray)),
		// target_account: CLValueBuilder.byteArray(fromPbKey.toAccountHash()),
		deposit_entry_point_name: CLValueBuilder.string(FUNCTIONS.SWAP_EXACT_CSPR_FOR_TOKENS),
		amount: CLValueBuilder.u512(transactionDetail.amountIn),
	}

	const runtimeArgs = RuntimeArgs.fromMap(mapping);

	return buildSwapEntryPointModulBytesDeploy(fromPbKey, runtimeArgs, getGasFee(FUNCTIONS.SWAP_EXACT_CSPR_FOR_TOKENS));
}

export const buildSwapCSPRForExactTokensDeploy = async (contractHash, transactionDetail = {}) => {
	const contractHashByteArray = contractHashToByteArray(contractHash);
	const fromPbKey = CLPublicKey.fromHex(transactionDetail.fromPublicKey);
	const toPbKey = CLPublicKey.fromHex(transactionDetail.toPublicKey);

	const mapping = {
		amount_out: CLValueBuilder.u256(transactionDetail.amountOut),
		amount_in_max: CLValueBuilder.u256(transactionDetail.amountInMax),
		path: CLValueBuilder.list(transactionDetail.path.map((token) => CLValueBuilder.string(token))),
		deadline: CLValueBuilder.u64(transactionDetail.deadline),
		contract_hash_key: new CLKey(CLValueBuilder.byteArray(contractHashByteArray)),
		target_account: CLValueBuilder.byteArray(fromPbKey.toAccountHash()),
		to: createRecipientAddress(toPbKey),
		deposit_entry_point_name: CLValueBuilder.string(FUNCTIONS.SWAP_CSPR_FOR_EXACT_TOKENS),
		amount: CLValueBuilder.u512(transactionDetail.amountInMax),
	}

	const runtimeArgs = RuntimeArgs.fromMap(mapping);

	return buildSwapEntryPointModulBytesDeploy(fromPbKey, runtimeArgs, getGasFee(FUNCTIONS.SWAP_CSPR_FOR_EXACT_TOKENS));
}

export const buildSwapTokensForExactTokensDeploy = async (contractHash, transactionDetail = {}) => {
	const fromPbKey = CLPublicKey.fromHex(transactionDetail.fromPublicKey);
	const toPbKey = CLPublicKey.fromHex(transactionDetail.toPublicKey);

	const mapping = {
		amount_out: CLValueBuilder.u256(transactionDetail.amountOut),
		amount_in_max: CLValueBuilder.u256(transactionDetail.amountInMax),
		path: CLValueBuilder.list(transactionDetail.path.map((token) => CLValueBuilder.string(token))),
		to: createRecipientAddress(toPbKey),
		deadline: CLValueBuilder.u64(transactionDetail.deadline),
		// contract_hash_key: CLValueBuilder.key(CLValueBuilder.byteArray(contractHashByteArray)),
		// amount: CLValueBuilder.u256(0),
		// deposit_entry_point_name: CLValueBuilder.string(FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS),
		// with_approve: CLValueBuilder.bool(true),
		// token0: CLValueBuilder.key(CLValueBuilder.byteArray(contractHashToByteArray(transactionDetail.path[0]))),
		// spender: CLValueBuilder.key(CLValueBuilder.byteArray(spenderHashByteArray)),
		// to: createRecipientAddress(toPbKey),
	}

	const runtimeArgs = RuntimeArgs.fromMap(mapping);

	return buildEntryPointDeploy(fromPbKey, contractHash, FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS, runtimeArgs, getGasFee(FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS));
}

// export const buildSwapTokensForExactTokensDeploy = async (contractHash, transactionDetail = {}) => {
// 	const contractHashByteArray = contractHashToByteArray(contractHash);
// 	const fromPbKey = CLPublicKey.fromHex(transactionDetail.fromPublicKey);
// 	const toPbKey = CLPublicKey.fromHex(transactionDetail.toPublicKey);

// 	const mapping = {
// 		amount_out: CLValueBuilder.u256(transactionDetail.amountOut),
// 		amount_in_max: CLValueBuilder.u256(transactionDetail.amountInMax),
// 		path: CLValueBuilder.list(transactionDetail.path.map((token) => CLValueBuilder.string(token))),
// 		deadline: CLValueBuilder.u64(transactionDetail.deadline),
// 		contract_hash_key: CLValueBuilder.key(CLValueBuilder.byteArray(contractHashByteArray)),
// 		amount: CLValueBuilder.u256(0),
// 		deposit_entry_point_name: CLValueBuilder.string(FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS),
// 		with_approve: CLValueBuilder.bool(true),
// 		token0: stringToCLKey(transactionDetail.path[0]),
// 		spender: stringToCLKey(transactionDetail.spenderPackageHash),
// 		to: createRecipientAddress(toPbKey),
// 	}

// 	const runtimeArgs = RuntimeArgs.fromMap(mapping);

// 	return buildSwapEntryPointModulBytesDeploy(fromPbKey, runtimeArgs, getGasFee(FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS));
// 	// return buildEntryPointDeploy(fromPbKey, contractHash, FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS, runtimeArgs, getGasFee(FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS));
// }


export const buildSwapExactTokensForTokensDeploy = async (contractHash, transactionDetail = {}) => {
	const contractHashByteArray = contractHashToByteArray(contractHash);
	const fromPbKey = CLPublicKey.fromHex(transactionDetail.fromPublicKey);
	const toPbKey = CLPublicKey.fromHex(transactionDetail.toPublicKey);

	const mapping = {
		amount_in: CLValueBuilder.u256(transactionDetail.amountIn),
		amount_out_min: CLValueBuilder.u256(transactionDetail.amountOutMin),
		path: CLValueBuilder.list(transactionDetail.path.map((token) => CLValueBuilder.string(token))),
		to: createRecipientAddress(toPbKey),
		deadline: CLValueBuilder.u64(transactionDetail.deadline),
		contract_hash_key: CLValueBuilder.key(CLValueBuilder.byteArray(contractHashByteArray)),
	}

	const runtimeArgs = RuntimeArgs.fromMap(mapping);

	return buildEntryPointDeploy(fromPbKey, contractHash, FUNCTIONS.SWAP_EXACT_TOKENS_FOR_TOKENS, runtimeArgs, getGasFee(FUNCTIONS.SWAP_EXACT_TOKENS_FOR_TOKENS));
}

export const buildSwapExactTokensForCSPRDeploy = async (contractHash, transactionDetail = {}) => {
	const fromPbKey = CLPublicKey.fromHex(transactionDetail.fromPublicKey);
	const toPbKey = CLPublicKey.fromHex(transactionDetail.toPublicKey);

	const mapping = {
		amount_in: CLValueBuilder.u256(transactionDetail.amountIn),
		amount_out_min: CLValueBuilder.u256(transactionDetail.amountOutMin),
		path: CLValueBuilder.list(transactionDetail.path.map((token) => CLValueBuilder.string(token))),
		target_account: CLValueBuilder.byteArray(toPbKey.toAccountHash()),
		deadline: CLValueBuilder.u64(transactionDetail.deadline),
	};

	const runtimeArgs = RuntimeArgs.fromMap(mapping);

	return buildEntryPointDeploy(fromPbKey, contractHash, FUNCTIONS.SWAP_EXACT_TOKENS_FOR_CSPR, runtimeArgs, getGasFee(FUNCTIONS.SWAP_EXACT_TOKENS_FOR_CSPR));
}

export const buildSwapTokensForExactCSPRDeploy = async (contractHash, transactionDetail = {}) => {
	const fromPbKey = CLPublicKey.fromHex(transactionDetail.fromPublicKey);
	const toPbKey = CLPublicKey.fromHex(transactionDetail.toPublicKey);

	const mapping = {
		amount_in_max: CLValueBuilder.u256(transactionDetail.amountInMax),
		amount_out: CLValueBuilder.u256(transactionDetail.amountOut),
		path: CLValueBuilder.list(transactionDetail.path.map((token) => CLValueBuilder.string(token))),
		target_account: CLValueBuilder.byteArray(toPbKey.toAccountHash()),
		deadline: CLValueBuilder.u64(transactionDetail.deadline),
	};

	const runtimeArgs = RuntimeArgs.fromMap(mapping);

	return buildEntryPointDeploy(fromPbKey, contractHash, FUNCTIONS.SWAP_TOKENS_FOR_EXACT_CSPR, runtimeArgs, getGasFee(FUNCTIONS.SWAP_TOKENS_FOR_EXACT_CSPR));
}

export const buildAddLiquidityForTokensDeploy = async(contractAddress, transactionDetail = {}) => {
	const contractHashByteArray = contractHashToByteArray(contractAddress);
	const pbKey = CLPublicKey.fromHex(transactionDetail.publicKey);

	const mapping = {
		token_a: stringToCLKey(transactionDetail.contractHashX),
		token_b: stringToCLKey(transactionDetail.contractHashY),
		amount_a_desired: CLValueBuilder.u256(transactionDetail.amountXDesired),
		amount_b_desired: CLValueBuilder.u256(transactionDetail.amountYDesired),
		amount_a_min: CLValueBuilder.u256(transactionDetail.amountXMin),
		amount_b_min: CLValueBuilder.u256(transactionDetail.amountYMin),
		to: createRecipientAddress(pbKey),
		deadline: CLValueBuilder.u64(transactionDetail.deadline),
		deposit_entry_point_name: CLValueBuilder.string(FUNCTIONS.ADD_LIQUIDITY),
		with_approve: CLValueBuilder.bool(false),
		amount: CLValueBuilder.u512(0),
		contract_hash_key: new CLKey(CLValueBuilder.byteArray(contractHashByteArray)),
	}

	const runtimeArgs = RuntimeArgs.fromMap(mapping);

	return buildLiquidityEntryPointModulBytesDeploy(pbKey, runtimeArgs, getGasFee(FUNCTIONS.ADD_LIQUIDITY));
}

export const buildAddLiquidityForCSPRAndTokenDeploy = async(contractAddress, transactionDetail = {}) => {
	const contractHashByteArray = contractHashToByteArray(contractAddress);
	const pbKey = CLPublicKey.fromHex(transactionDetail.publicKey);

	const mapping = {
		token: stringToCLKey(transactionDetail.tokenContractHash),
		amount_token_desired: CLValueBuilder.u256(transactionDetail.amountTokenDesired),
		amount_cspr_desired: CLValueBuilder.u256(transactionDetail.amountCSPRDesired),
		amount_token_min: CLValueBuilder.u256(transactionDetail.amountTokenMin),
		amount_cspr_min: CLValueBuilder.u256(transactionDetail.amountCSPRMin),
		to: createRecipientAddress(pbKey),
		deadline: CLValueBuilder.u64(transactionDetail.deadline),
		target_account: CLValueBuilder.byteArray(pbKey.toAccountHash()),
		contract_hash_key: new CLKey(CLValueBuilder.byteArray(contractHashByteArray)),
		deposit_entry_point_name: CLValueBuilder.string(FUNCTIONS.ADD_LIQUIDITY_CSPR),
		amount: CLValueBuilder.u512(1000000000),
		with_approve: CLValueBuilder.bool(false),
	}

	const runtimeArgs = RuntimeArgs.fromMap(mapping);

	return buildLiquidityEntryPointModulBytesDeploy(pbKey, runtimeArgs, getGasFee(FUNCTIONS.ADD_LIQUIDITY_CSPR));
}

/**
 * @param publicKey - The public key of the account that will be used to deploy the contract.
 * @param runtimeArgs - The arguments to pass to the contract.
 * @param paymentAmount - The amount of tokens to pay for the deploy.
 * @returns The deploy is being returned.
 */
export const buildSwapEntryPointModulBytesDeploy = async (publicKey, runtimeArgs, paymentAmount) => {
	const hex = await getSwapModuleBytes();
	
	return DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(publicKey, NETWORK_NAME, 1, DEPLOY_TTL_MS),
		DeployUtil.ExecutableDeployItem.newModuleBytes(
			Uint8Array.from(Buffer.from(hex, 'hex'))
			, runtimeArgs),

		DeployUtil.standardPayment(paymentAmount),
	);
};


/**
 * @param publicKey - The public key of the account that will be used to deploy the contract.
 * @param runtimeArgs - The arguments to pass to the contract.
 * @param paymentAmount - The amount of tokens to pay for the deploy.
 * @returns The deploy is being returned.
 */
export const buildLiquidityEntryPointModulBytesDeploy = async (publicKey, runtimeArgs, paymentAmount) => {
	const hex = await getLiquidityModuleBytes();
	
	return DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(publicKey, NETWORK_NAME, 1, DEPLOY_TTL_MS),
		DeployUtil.ExecutableDeployItem.newModuleBytes(
			Uint8Array.from(Buffer.from(hex, 'hex'))
			, runtimeArgs),

		DeployUtil.standardPayment(paymentAmount),
	);
};

/**
 * @param publicKey - The public key of the account that will be used to deploy the contract.
 * @param contractHash - The hash of the contract to be deployed.
 * @param entryPoint - The entry point.
 * @param runtimeArgs - The arguments to pass to the contract.
 * @param paymentAmount - The amount of tokens to pay for the deploy.
 * @returns The deploy is being returned.
 */
export const buildEntryPointDeploy = (publicKey, contractHash, entryPoint, runtimeArgs, paymentAmount) => {
	const contractHashAsByteArray = [...Buffer.from(contractHash, 'hex')];

	return DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(publicKey, NETWORK_NAME, 1, DEPLOY_TTL_MS),
		DeployUtil.ExecutableDeployItem.newStoredContractByHash(contractHashAsByteArray, entryPoint, runtimeArgs),
		DeployUtil.standardPayment(paymentAmount),
	);
};