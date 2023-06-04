import { User, EncryptionType } from 'casper-storage';
import { DeployUtil, signFormattedMessage } from 'casper-js-sdk';
import _get from 'lodash-es/get';
import UserService from '@cd/services/ServiceWorker/UserService';
import { getConnectedAccountChromeLocalStorage, cacheLoginInfoToLocalStorage } from '@cd/actions/userActions.utils';
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
		try {
			const cacheConnectedAccount = await getConnectedAccountChromeLocalStorage();

			const { userCache, selectedWallet } = await UserService.makeUserFromCache(password, cacheConnectedAccount);

			if (!userCache) {
				throw Error('Missing User');
			}
			const user = new UserService(userCache, { selectedWalletUID: selectedWallet.uid });
			const result = await user.prepareStorageData(true);

			this.userService = user;
			return result;
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
		}
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
		const asymKey = await this.userService.generateKeypair();
		const deployResult = DeployUtil.deployFromJson(deployJSON);

		if (deployResult.err) {
			throw Error('Something went wrong with deployResult');
		}

		const signedDeploy = deployResult.val.sign([asymKey]);
		return DeployUtil.deployToJson(signedDeploy);
	};

	signMessagePrivateKeyProcess = async ({ messageBytes }) => {
		const asymKey = await this.userService.generateKeypair();

		return signFormattedMessage(asymKey, messageBytes);
	};

	getKeyphrase = async ({ password }) => {
		try {
			const { userDetails } = await this.validateReturningUser({ password });
			if (!userDetails) {
				throw Error('Invalid password');
			}
			return this.userService.getKeyphrase();
		} catch (error) {
			console.error(error);
			throw Error('Invalid password');
		}
	};

	getWallets = async () => {
		const wallets = (await this.userService.getWallets()) || [];

		return wallets;
	};

	addWalletAccount = async ({ index, description }) => {
		return this.userService.addWalletAccount(index, description);
	};

	setSelectedWallet = async ({ uid }) => {
		await this.userService.setSelectedWallet(uid);
		this.appStore.updateState({ activePublicKey: await this.userService.getPublicKey(uid) });

		return this.userService.prepareStorageData();
	};

	isUserExist = () => {
		return !!this.userService;
	};

	addLegacyAccount = async ({ name, secretKey }) => {
		return await this.userService.addLegacyAccount(name, secretKey);
	};

	getPrivateKey = async ({ password }) => {
		try {
			const { userDetails } = await this.validateReturningUser({ password });
			return await this.userService.getPrivateKeyPEM(userDetails.selectedWallet.uid);
		} catch (error) {
			console.error(error);
			throw Error('Invalid password');
		}
	};

	getCurrentPublicKey = async () => {
		const user = await getConnectedAccountChromeLocalStorage();

		return _get(user, 'publicKey', null);
	};

	updateAccountName = async ({ uid, newName }) => {
		return await this.userService.updateAccountName(uid, newName);
	};

	lockWallet = async () => {
		const connectedAccount = await getConnectedAccountChromeLocalStorage();
		const { loginOptions: loginOptionsCache } = connectedAccount;

		const emptyPublicKey = '';
		await cacheLoginInfoToLocalStorage(emptyPublicKey, loginOptionsCache);

		this.userService = undefined;
	}
}

export default AccountController;
