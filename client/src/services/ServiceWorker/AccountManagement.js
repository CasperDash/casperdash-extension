import { WalletDescriptor, User, EncryptionType } from 'casper-storage';

const encryptionType = EncryptionType.Ed25519;

const onCreateNewUser = async ({ password, keyphrase }) => {
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

	return publicKey;
};

export { onCreateNewUser };
