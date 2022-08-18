import { Keys, CLPublicKey } from 'casper-js-sdk';
import { toMotes } from '../helpers/currency';
import { buildTransferDeploy } from './casperServices';

class UserService {
	_user;

	constructor() {}

	set instance(user) {
		this._user = user;
	}

	get instance() {
		return this._user ?? undefined;
	}

	async generateKeypair(loginInfo = {}) {
		try {
			const currentWalletIndex = loginInfo?.currentWalletIndex ?? 0;
			const encryptionType = loginInfo?.encryptionType ?? 'Ed25519';
			const user = this.instance;

			const wallet = await user.getWalletAccount(currentWalletIndex);
			const publicKey = await wallet.getPublicKeyByteArray();
			const secretKey = wallet.getPrivateKeyByteArray();
			return Keys[encryptionType].parseKeyPair(publicKey.slice(1), secretKey);
		} catch (error) {
			return undefined;
		}
	}
}

/**
 * It builds a transfer deploy.
 * @param transactionDetail
 * @returns The transfer deploy.
 */
export const getTransferDeploy = (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, transferId = 0, fee } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		return buildTransferDeploy(fromPbKey, toPbKey, toMotes(amount), transferId, fee);
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to build transfer deploy.`);
	}
};

export default new UserService();
