import { User, EncryptionType } from 'casper-storage';
import { DeployUtil } from 'casper-js-sdk';
import UserService from '@cd/services/UserService';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';

class AccountController {
	/**
	 * Only available after creating new User or successfully
	 * validate a returning User (WelcomeBack)
	 */
	userService;
	constructor(appStore) {
		this.appStore = appStore;
	}

	getCurrentUser = () => {
		return this.userService;
	};

	validateReturningUser = async ({ password }) => {
		const cacheConnectedAccount = await getConnectedAccountChromeLocalStorage();

		const { userCache, selectedWallet } = await UserService.makeUserFromCache(password, cacheConnectedAccount);

		if (!userCache) {
			throw Error('Missing User');
		}
		const user = new UserService(userCache, { selectedWalletUID: selectedWallet.uid });
		const result = await user.prepareStorageData(true);

		this.userService = user;
		return result;
	};

	createNewUser = async ({ password, keyphrase, encryptionType = EncryptionType.Ed25519 }) => {
		if (!password) {
			throw Error('Missing password');
		}

		if (!keyphrase) {
			throw Error('Missing keyphrase');
		}

		// Create new User
		try {
			const opts = {
				encryptionType,
			};
			const user = new UserService(new User(password), opts);

			await user.initialize(keyphrase);

			this.userService = user;
			this.appStore.putState({ user });

			return await this.userService.prepareStorageData();
		} catch (error) {
			console.error(error);
			throw Error('Error on create new User');
		}
	};

	clearUser = () => {
		this.appStore.putState(undefined);
	};

	getPublicKey = async () => {
		if (!this.userService) {
			throw new Error('Missing UserService instance');
		}

		return this.userService.getPublicKey();
	};

	signPrivateKeyProcess = async ({ deployJSON }) => {
		const asymKey = await this.generateKeypair();
		const deployResult = DeployUtil.deployFromJson(deployJSON);

		if (deployResult.err) {
			throw Error('Something went wrong with deployResult');
		}

		const signedDeploy = deployResult.val.sign([asymKey]);
		return DeployUtil.deployToJson(signedDeploy);
	};

	getKeyphrase = () => {
		return this.userService.getKeyphrase();
	};

	getHDWallets = async () => {
		const hdWallets = (await this.userService.getHDWallets()) || [];

		return hdWallets;
	};

	addWalletAccount = async ({ index, description }) => {
		return this.userService.addWalletAccount(index, description);
	};

	setSelectedWallet = async ({ uid }) => {
		await this.userService.setSelectedWallet(uid);

		return this.userService.prepareStorageData();
	};

	isUserExist = () => {
		return !!this.userService;
	};

	addLegacyAccount = async ({ name, secretKey }) => {
		return await this.userService.addLegacyAccount(name, secretKey);
	};
}

export default AccountController;
