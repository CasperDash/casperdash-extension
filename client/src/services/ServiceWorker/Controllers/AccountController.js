import { Keys } from 'casper-js-sdk';
import { WalletDescriptor, User, EncryptionType } from 'casper-storage';
import UserService from "@cd/services/UserService";

const encryptionType = EncryptionType.Ed25519;

class AccountController {
	constructor(appStore) {
		this.appStore = appStore;
	}

	getCurrentUser = () => this.appStore.getState()?.user ?? undefined;

	generateKeypair = async () => {
		try {
			const currentWalletIndex = 0;
			const encryptionType = 'Ed25519';
			const user = this.getCurrentUser();

			const wallet = await user.getWalletAccount(currentWalletIndex);
			const publicKey = await wallet.getPublicKeyByteArray();
			const secretKey = wallet.getPrivateKeyByteArray();
			
			return Keys[encryptionType].parseKeyPair(publicKey.slice(1), secretKey);
		} catch (error) {
			return undefined;
		}
	}

	validateReturningUser = async ({ password }) => {
		const user = this.getCurrentUser();
		console.log(`🚀 ~ AccountController ~ validateReturningUser= ~ user`, user)

		if (!user) {
			throw Error("Missing User");
		}

		const userHashingOptions = user.getPasswordHashingOptions();
		const userInfo = user.serialize();

		// Deserialize user info to an instance of User
		const newUser = User.deserializeFrom(password, userInfo, {
			passwordOptions: userHashingOptions,
		});

		const currentWalletIndex = 0;
		const wallet = await newUser.getWalletAccount(currentWalletIndex);
		const newPublicKey = await wallet.getPublicKey();

		return newPublicKey;
	}

	createNewUser = async ({ password, keyphrase }) => {
		if (!password) {
			throw Error('Missing password');
		}

		if (!keyphrase) {
			throw Error('Missing keyphrase');
		}

		// Create new User
		let user;
		try {
			const opts = {
				encryptionType,
				currentWalletIndex: 0
			}
			user = new UserService(new User(password), opts);
			user.initialize(keyphrase);
		} catch (error) {
			console.error(error);
			throw Error('Error on create new User');
		}
	
		const userInfo = await user.getUserInfoHash();
		const publicKey = await user.getPublicKey();


		return { publicKey, userDetails: {
			userHashingOptions: userInfo.userHashingOptions,
			userInfo: userInfo.userInfo,
			currentWalletIndex: user.currentWalletIndex
		}};
	};

	clearUser = () => {
		this.appStore.putState(undefined);
	}

	getPublicKey = async () => {
		const user = this.appStore.getState().user;
		if (!user) {
			throw Error('Cant find user');
		}
		const wallet = await user.getWalletAccount(0);
		return await wallet.getPublicKey();
	};
}

export default AccountController;
