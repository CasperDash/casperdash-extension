import { WalletDescriptor, User, EncryptionType } from 'casper-storage';
import { Keys } from 'casper-js-sdk';
import capitalize from 'lodash-es/capitalize';
import { CONNECTION_TYPES } from '@cd/constants/settings';
/**
 * This class serves every tasks related to User
 * From extension to service worker and vice versa
 */
export class UserService {
	_user;
	currentWalletIndex = 0;
  connectionType = CONNECTION_TYPES.privateKey;

	static convertSaltInfo(salt) {
		const saltInfo = Object.keys(salt).map((key) => salt[key]);
		return new Uint8Array(saltInfo);
	}

	static makeUserFromCache(password, cacheConnectedAccount) {
		const {
			loginOptions: { userHashingOptions, userInfo: encryptedUserInfo },
		} = cacheConnectedAccount;

		// Get encrypted info from Localstorage
		const encryptedHashingOptions = JSON.parse(userHashingOptions);

		// Convert salt info from object to Array
		// This is used for creating new Uint8Array instance
		const userLoginOptions = {
			...encryptedHashingOptions,
			salt: UserService.convertSaltInfo(encryptedHashingOptions.salt),
		};

		// Deserialize user info to an instance of User
		return User.deserializeFrom(password, encryptedUserInfo, {
			passwordOptions: userLoginOptions,
		});
	}

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

	/**
	 * Get User instane of casper-storage
	 */
	get instance() {
		return this._user ?? undefined;
	}

	/**
	 * Initialize with `keyphrase` passed when creating new User
	 */
	initialize = async (keyphrase) => {
		const user = this.instance;
		// Set HDWallet info
		user.setHDWallet(keyphrase, this.encryptionType);
		await user.addWalletAccount(0, new WalletDescriptor('Account 1'));

		return this;
	};

	getPublicKey = async (index = 0) => {
		try {
			const user = this.instance;
			const wallet = await user.getWalletAccount(index);

			return wallet?.getPublicKey() ?? undefined;
		} catch (err) {
			console.log(`🚀 ~ UserService::getPublicKey: `, err);
			return undefined;
		}
	};

	/**
	 * Return a pair of User login info after creating new User
	 * @returns { userHashingOptions, userInfo }
	 */
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

	/**
	 * Return full data needed for storing in redux store
	 * and Google chrome storage API
	 * @returns
	 */
	prepareStorageData = async () => {
		const userInfo = await this.getUserInfoHash();
		const publicKey = await this.getPublicKey();

		return {
			publicKey,
			userDetails: {
				userHashingOptions: userInfo.userHashingOptions,
				userInfo: userInfo.userInfo,
				currentWalletIndex: this.currentWalletIndex,
			},
		};
	};

	generateKeypair = async () => {
		try {
			const user = this.instance;

			const wallet = await user.getWalletAccount(this.currentWalletIndex);
      const encryptionType = wallet?.getEncryptionType();
      console.log(`🚀 ~ file: UserService.js ~ line 143 ~ UserService ~ generateKeypair= ~ encryptionType`, encryptionType)
			const publicKey = await wallet.getPublicKeyByteArray();
      console.log(`🚀 ~ file: UserService.js ~ line 145 ~ UserService ~ generateKeypair= ~ publicKey`, publicKey)
			const secretKey = wallet.getPrivateKeyByteArray();
      console.log(`🚀 ~ file: UserService.js ~ line 147 ~ UserService ~ generateKeypair= ~ secretKey`, secretKey)
      const result = Keys[capitalize(encryptionType)].parseKeyPair(publicKey.slice(1), secretKey);
      console.log(`🚀 ~ file: UserService.js ~ line 149 ~ UserService ~ generateKeypair= ~ result`, result)
			return result;
		} catch (error) {
			return undefined;
		}
	}
}

export default UserService;
// export default new UserService();
