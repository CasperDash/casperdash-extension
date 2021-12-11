import { CLValueBuilder, CLTypeBuilder, CLPublicKey, RuntimeArgs, DeployUtil } from 'casper-js-sdk';
import { None } from 'ts-results';
import { toMotes } from '../helpers/currency';
import { NETWORK_NAME, DEPLOY_TTL_MS } from '../constants/key';
import { createRecipientAddress, toCLMap, signDeploy, contractHashToByteArray } from './casperServices';

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
