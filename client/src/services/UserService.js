import { WalletDescriptor, User, EncryptionType, CasperLegacyWallet, KeyParser } from 'casper-storage';
import { Keys } from 'casper-js-sdk';
import { CONNECTION_TYPES } from '@cd/constants/settings';
import { setChromeStorageLocal, getChromeStorageLocal } from '@cd/services/localStorage';

/**
 * This class serves every tasks related to User
 * From extension to service worker and vice versa
 */
export class UserService {
	_user;
	selectedWalletUID;
	connectionType = CONNECTION_TYPES.privateKey;

	static async makeUserFromCache(password, cacheConnectedAccount) {
		const {
			loginOptions: { userInfo: encryptedUserInfo, selectedWallet },
		} = cacheConnectedAccount;

		// Deserialize user info to an instance of User
		const userCache = await User.deserializeFrom(password, encryptedUserInfo);
		return { userCache, selectedWallet };
	}

	constructor(user, opts = {}) {
		this.instance = user;
		this.encryptionType = opts?.encryptionType ?? EncryptionType.Ed25519;
		this.selectedWalletUID = opts?.selectedWalletUID;
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
		const wallets = user.getHDWallet().derivedWallets || [];
		const selectedWallet = wallets[0];

		this.setSelectedWallet(selectedWallet.uid);
		return user;
	};

	getWalletDetails = async (uid) => {
		const user = this.instance;
		const fullWalletInfo = user.getWalletInfo(uid);

		if (fullWalletInfo.isHDWallet) {
			const index = fullWalletInfo.index;
			const wallet = await user.getWalletAccount(index);
			return wallet;
		} else if (fullWalletInfo.isLegacy) {
			const wallet = new CasperLegacyWallet(fullWalletInfo.id, fullWalletInfo.encryptionType);
			return wallet;
		}
	};

	getPublicKey = async (uid) => {
		try {
			const wallet = await this.getWalletDetails(uid);

			return wallet?.getPublicKey() ?? undefined;
		} catch (err) {
			// eslint-disable-next-line no-console
			return undefined;
		}
	};

	/**
	 * Return a pair of User login info after creating new User
	 * @returns {  userInfo }
	 */
	getUserInfoHash = async () => {
		const user = this.instance;

		// Serialize user information to a secure encrypted string
		const userInfo = await user.serialize();

		return userInfo;
	};

	/* Storing the public key and login options in the chrome storage. */
	storeData = async (publicKey, loginOptions) => {
		if (publicKey) {
			await setChromeStorageLocal({ key: 'publicKey', value: publicKey ?? '' });
		}
		const storedLoginOptions = await getChromeStorageLocal('loginOptions');

		await setChromeStorageLocal({
			key: 'loginOptions',
			value: { ...(storedLoginOptions && storedLoginOptions.loginOptions), ...loginOptions },
		});
	};

	/**
	 * Return full data needed for storing in redux store
	 * and Google chrome storage API
	 * isLoad : no need to store data if loading user
	 * @returns
	 */
	prepareStorageData = async (isLoad, uid) => {
		/**
		 * Ignore removing `await` from Sonarcloud audit.
		 * This will return user info with hash info
		 */
		const user = this.instance;
		const userInfo = await this.getUserInfoHash();
		const publicKey = await this.getPublicKey(uid || this.selectedWalletUID);
		const walletDetails = await this.getWalletDetails(uid || this.selectedWalletUID);
		const wallet = user.getWalletInfo(walletDetails.getReferenceKey());

		const selectedWallet = {
			descriptor: wallet.descriptor,
			uid: wallet.uid,
			encryptionType: wallet.encryptionType,
		};
		if (!isLoad) {
			await this.storeData(publicKey, { userInfo, selectedWallet, connectionType: this.connectionType });
		}

		return {
			publicKey,
			userDetails: {
				selectedWallet,
				connectionType: this.connectionType,
			},
		};
	};

	/**
	 * Return an AsymmetricKey keyPair from a public key and private key
	 * @returns AsymmetricKey
	 */
	generateKeypair = async () => {
		try {
			let publicKey;
			let privateKey;
			const walletDetails = await this.getWalletDetails(this.selectedWalletUID);
			if (walletDetails) {
				publicKey = await walletDetails.getPublicKeyByteArray();
				privateKey = walletDetails.getPrivateKeyByteArray();

				// need to slice prefix
				const trimmedPublicKey = publicKey.slice(1);
				if (walletDetails.encryptionType === EncryptionType.Ed25519) {
					return Keys.Ed25519.parseKeyPair(trimmedPublicKey, privateKey);
				} else {
					return Keys.Secp256K1.parseKeyPair(trimmedPublicKey, privateKey, 'raw');
				}
			} else {
				throw Error('Error on get Keys');
			}
		} catch (error) {
			return undefined;
		}
	};

	getWallets = async () => {
		const user = this.instance;

		const wallets = user.getHDWallet().derivedWallets || [];
		const legacyWallets = user.getLegacyWallets() || [];
		if (wallets.length === 0 && legacyWallets.length === 0) {
			return [];
		}

		return await Promise.all(
			wallets.concat(legacyWallets).map(async (wallet) => ({
				//should not spread wallet here, wallet have some sensitive info
				descriptor: wallet.descriptor,
				uid: wallet.uid,
				encryptionType: wallet.encryptionType,
				publicKey: await this.getPublicKey(wallet.uid),
			})),
		);
	};

	addWalletAccount = async (index, description) => {
		const user = this.instance;
		user.addWalletAccount(index, description);
		return await this.prepareStorageData();
	};

	getKeyphrase = async () => {
		const user = this.instance;

		return user.getHDWallet().keyPhrase;
	};

	setSelectedWallet = (uid) => {
		this.selectedWalletUID = uid;
	};

	addLegacyAccount = async (name, secretKey) => {
		try {
			const user = this.instance;
			const keyParser = KeyParser.getInstance();
			const keyValue = keyParser.convertPEMToPrivateKey(secretKey);
			const wallet = new CasperLegacyWallet(keyValue.key, keyValue.encryptionType);

			user.addLegacyWallet(wallet, new WalletDescriptor(name));
			const walletInfo = user.getWalletInfo(wallet.getReferenceKey());
			this.selectedWalletUID = walletInfo.uid;
			return await this.prepareStorageData(false, walletInfo.uid);
		} catch (error) {
			throw Error(error.message);
		}
	};

	getPrivateKeyPEM = async (uid) => {
		try {
			const wallet = await this.getWalletDetails(uid);
			return wallet?.getPrivateKeyInPEM();
		} catch (error) {
			console.error(error);
			throw Error(error.message);
		}
	};

	updateAccountName = async (uid, newName) => {
		try {
			this.instance.setWalletInfo(uid, newName);
			const userInfo = await this.getUserInfoHash();
			await this.storeData(undefined, { userInfo });
			return true;
		} catch (error) {
			console.error(error);
			throw Error(error.message);
		}
	};
}

export default UserService;
