import { CLValueBuilder, CLPublicKey, RuntimeArgs, DeployUtil } from 'casper-js-sdk';
import { toMotes } from '../helpers/currency';
import { NETWORK_NAME, DEPLOY_TTL_MS } from '../constants/key';
import { createRecipientAddress, contractHashToByteArray } from './casperServices';
import { getConfigKey } from './configurationServices';

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
 * @deprecated
 */
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

		return getTransferNFTDeploy(pbKey, runtimeArgs, contractHashByteArray, entryPoint, toMotes(2.5));
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to get transfer NFT deploy due to ${error}`);
	}
};
