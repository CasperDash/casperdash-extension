import { CLValueBuilder, CLTypeBuilder, CLPublicKey, RuntimeArgs, DeployUtil } from 'casper-js-sdk';
import { None } from 'ts-results';
import { toMotes } from '../helpers/currency';
import { NETWORK_NAME, DEPLOY_TTL_MS } from '../constants/key';
import { createRecipientAddress, toCLMap, signDeploy, contractHashToByteArray } from './casperServices';
import { request } from './request';

export const getMintNFTDeploy = (publicKey, runtimeArgs, contractHash, paymentAmount) => {
	return DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(publicKey, NETWORK_NAME, 1, DEPLOY_TTL_MS),
		DeployUtil.ExecutableDeployItem.newStoredContractByHash(contractHash, 'mint_one', runtimeArgs),
		DeployUtil.standardPayment(paymentAmount),
	);
};

export const getSingedMintDeploy = async (nftInfo) => {
	try {
		const { recipient, metadata, publicKey, nftContract } = nftInfo;
		const toAddress = recipient || publicKey;
		const contractHashByteArray = contractHashToByteArray(nftContract.slice(5));
		const pbKey = CLPublicKey.fromHex(publicKey);
		const recipientPK = CLPublicKey.fromHex(toAddress);
		const tokenId = CLValueBuilder.option(None, CLTypeBuilder.string());
		const runtimeArgs = RuntimeArgs.fromMap({
			recipient: createRecipientAddress(recipientPK),
			token_id: tokenId,
			token_meta: toCLMap(new Map(metadata)),
		});
		const deploy = getMintNFTDeploy(pbKey, runtimeArgs, contractHashByteArray, toMotes(1));
		const signedDeploy = await signDeploy(deploy, publicKey, toAddress);

		return signedDeploy;
	} catch (error) {
		return { error: error.message };
	}
};

const getNFTContractDeploy = async () => {
	return await request('/nfts/getNFTContractDeploy');
};

/**
 * Get deploy for keys manager contract
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
export const nftContractDeploy = async (mainAccount, name, symbol, casperApp) => {
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

		let deploy = DeployUtil.makeDeploy(
			new DeployUtil.DeployParams(mainAccountPK, NETWORK_NAME, 1, DEPLOY_TTL_MS),
			modulesBytes,
			DeployUtil.standardPayment(toMotes(100)),
		);

		const signedDeploy = await signDeploy(deploy, mainAccount, mainAccount, casperApp);

		return signedDeploy;
	} catch (error) {
		return { error: { message: error.message } };
	}
};
