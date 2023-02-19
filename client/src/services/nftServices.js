import { CLValueBuilder, CLTypeBuilder, CLPublicKey, RuntimeArgs, DeployUtil } from 'casper-js-sdk';
import { None } from 'ts-results';
import { toMotes } from '../helpers/currency';
import { NETWORK_NAME, DEPLOY_TTL_MS } from '../constants/key';
import { createRecipientAddress, toCLMap, contractHashToByteArray } from './casperServices';
import { request } from './request';
import { getConfigKey } from './configurationServices';

/**
 * Get mint NFT deploy
 * @param {CLPublicKey} publicKey
 * @param {object} runtimeArgs
 * @param {string} contractHash
 * @param {number} paymentAmount
 */
export const getMintNFTDeploy = (publicKey, runtimeArgs, contractHash, paymentAmount) => {
	return DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(publicKey, NETWORK_NAME, 1, DEPLOY_TTL_MS),
		DeployUtil.ExecutableDeployItem.newStoredContractByHash(contractHash, 'mint_one', runtimeArgs),
		DeployUtil.standardPayment(paymentAmount),
	);
};

/**
 * * Create a NFT transfer deploy
 * @param publicKey - The public key of the account that will be used to deploy the contract.
 * @param runtimeArgs - The arguments to pass to the contract.
 * @param contractHash - The hash of the contract to be deployed.
 * @param entryPoint - The entry point.
 * @param paymentAmount - The amount of tokens to pay for the deploy.
 * @returns The deploy is being returned.
 */
export const getTransferNFTDeploy = (publicKey, runtimeArgs, contractHash, entryPoint, paymentAmount) => {
	return DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(publicKey, NETWORK_NAME, 1, DEPLOY_TTL_MS),
		DeployUtil.ExecutableDeployItem.newStoredContractByHash(contractHash, entryPoint, runtimeArgs),
		DeployUtil.standardPayment(paymentAmount),
	);
};

/**
 * Get mint nft deploy
 * @param {object} nftInfo
 */
export const getMintDeploy = (nftInfo) => {
	try {
		const { recipient, metadata, publicKey, nftContract } = nftInfo;
		const toAddress = recipient || publicKey;
		const contractHashByteArray = contractHashToByteArray(nftContract.slice(5));
		const pbKey = CLPublicKey.fromHex(publicKey);
		const recipientPK = CLPublicKey.fromHex(toAddress);
		const tokenId = CLValueBuilder.option(None, CLTypeBuilder.u256());
		const runtimeArgs = RuntimeArgs.fromMap({
			recipient: createRecipientAddress(recipientPK),
			token_id: tokenId,
			token_meta: toCLMap(new Map(metadata)),
		});
		return getMintNFTDeploy(pbKey, runtimeArgs, contractHashByteArray, toMotes(1));
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get mint NFT deploy.`);
	}
};

export const getTransferDeploy = ({ publicKey, recipient, nftContract, tokenId }) => {
	try {
		const recipientPK = CLPublicKey.fromHex(recipient);
		const contractHashByteArray = contractHashToByteArray(nftContract.replace('hash-', ''));
		const pbKey = CLPublicKey.fromHex(publicKey);
		let mapping = {
			sender: createRecipientAddress(pbKey),
			recipient: createRecipientAddress(recipientPK),
		};

		const oldNFTAddresses = getConfigKey('OLD_NFT_SMART_CONTRACT_ADDRESSES')
			? getConfigKey('OLD_NFT_SMART_CONTRACT_ADDRESSES')
			: [];

		let entryPoint = 'transfer';
		if (oldNFTAddresses.indexOf(nftContract) > 0) {
			entryPoint = 'transfer_token';
			mapping['token_id'] = CLValueBuilder.string(tokenId);
		} else {
			mapping['token_ids'] = CLValueBuilder.list([CLValueBuilder.string(tokenId)]);
		}

		const runtimeArgs = RuntimeArgs.fromMap(mapping);

		return getTransferNFTDeploy(pbKey, runtimeArgs, contractHashByteArray, entryPoint, toMotes(10));
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get transfer NFT deploy due to ${error}`);
	}
};

/**
 * get NFT contract
 */
const getNFTContractDeploy = async () => {
	return await request('/nfts/getNFTContractDeploy');
};

/**
 * Get deploy for keys manager contract
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
export const nftContractDeploy = async (mainAccount, name, symbol) => {
	try {
		const massagedName = name.includes('nft') ? name : `${name}_nft`;
		const mainAccountPK = CLPublicKey.fromHex(mainAccount);
		const nftSampleContract = await getNFTContractDeploy();

		const runtimeArgs = RuntimeArgs.fromMap({
			token_name: CLValueBuilder.string(massagedName),
			token_symbol: CLValueBuilder.string(symbol),
			token_meta: toCLMap(new Map([['test', 'test']])),
		});
		const modulesBytes = DeployUtil.ExecutableDeployItem.newModuleBytes(
			new Uint8Array(Buffer.from(nftSampleContract.deploy.session.ModuleBytes.module_bytes, 'hex')),
			runtimeArgs,
		);

		return DeployUtil.makeDeploy(
			new DeployUtil.DeployParams(mainAccountPK, NETWORK_NAME, 1, DEPLOY_TTL_MS),
			modulesBytes,
			DeployUtil.standardPayment(toMotes(100)),
		);
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get NFT contract deploy.`);
	}
};
