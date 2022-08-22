import { WalletDescriptor, User, EncryptionType } from 'casper-storage';
import { Keys } from 'casper-js-sdk';

export class UserService {
	_user;
	currentWalletIndex = 0;

	constructor(user, opts = {}) {
		this.instance = user;
		this.encryptionType = opts?.encryptionType ?? EncryptionType.Ed25519;
		this.currentWalletIndex = opts?.currentWalletIndex ?? 0;
	}

	/**
	 * Set User instane of casper-storage
	 */
	set instance(user) {
		this._user = user;
	}

	get instance() {
		return this._user ?? undefined;
	}

	initialize = async keyphrase => {
		const user = this.instance;
		// Set HDWallet info
		user.setHDWallet(keyphrase, this.encryptionType);
		await user.addWalletAccount(0, new WalletDescriptor('Account 1'));
		
		return this;
	}

	getPublicKey = async (index = 0) => {
		try {
			const user = this.instance;
			const wallet = await user.getWalletAccount(index);

			return wallet?.getPublicKey() ?? undefined;
		} catch (err) {
			console.log(`🚀 ~ UserService ~ getPublicKey= ~ err`, err)
			return undefined;
		}
	}

	getUserInfoHash = async () => {
		const user = this.instance;
	
		// Take the hashing options from user's instance
		const hashingOptions = user.getPasswordHashingOptions();
		const userHashingOptions = JSON.stringify(hashingOptions);

		// Serialize user information to a secure encrypted string
		const userInfo = user.serialize();

		return {
			userHashingOptions,
			userInfo,
		};
	};

	/** TODO
	 * Move into SW
	 */
	async generateKeypair(loginInfo = {}) {
		// try {
		// 	const currentWalletIndex = loginInfo?.currentWalletIndex ?? 0;
		// 	const encryptionType = loginInfo?.encryptionType ?? 'Ed25519';
		// 	const user = this.instance;

		// 	const wallet = await user.getWalletAccount(currentWalletIndex);
		// 	const publicKey = await wallet.getPublicKeyByteArray();
		// 	const secretKey = wallet.getPrivateKeyByteArray();
		// 	return Keys[encryptionType].parseKeyPair(publicKey.slice(1), secretKey);
		// } catch (error) {
		// 	return undefined;
		// }
	}
}

export default UserService;
// export default new UserService();
