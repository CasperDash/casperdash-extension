import { WalletDescriptor, User, EncryptionType } from 'casper-storage';

const encryptionType = EncryptionType.Ed25519;

class AccountController {
	constructor(appStore) {
		this.appStore = appStore;
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
			user = new User(password);
		} catch (error) {
			console.error(error);
			throw Error('Error on create new User');
		}

		// Set HDWallet info
		user.setHDWallet(keyphrase, encryptionType);

		const wallet = await user.addWalletAccount(0, new WalletDescriptor('Account 1'));
		const publicKey = await wallet.getPublicKey();
		this.appStore.putState({ user });

		return publicKey;
	};

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
