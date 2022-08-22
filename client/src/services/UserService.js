import { Keys } from 'casper-js-sdk';

export class UserService {
	_user;

	set instance(user) {
		this._user = user;
	}

	get instance() {
		return this._user ?? undefined;
	}

	/** TODO
	 * Move into SW
	 */
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

export default new UserService();
