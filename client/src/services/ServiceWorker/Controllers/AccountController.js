import { User, EncryptionType } from 'casper-storage';
import { DeployUtil } from 'casper-js-sdk';
import UserService from '@cd/services/UserService';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';

const encryptionType = EncryptionType.Ed25519;

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

	generateKeypair = async () => {
		try {
			if (!this.userService) {
				throw new Error('Missing UserService instance');
			}

			return await this.userService.generateKeypair();
		} catch (error) {
			return undefined;
		}
	};

	validateReturningUser = async ({ password }) => {
		const cacheConnectedAccount = await getConnectedAccountChromeLocalStorage();
		const userCache = UserService.makeUserFromCache(password, cacheConnectedAccount);

		if (!userCache) {
			throw Error('Missing User');
		}
		const user = new UserService(userCache);
		const result = await user.prepareStorageData();

		this.userService = user;
		return result;
	};

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
				currentWalletIndex: 0,
			};
			user = new UserService(new User(password), opts);

			user.initialize(keyphrase);

			this.userService = user;
			this.appStore.putState({ user });
		} catch (error) {
			console.error(error);
			throw Error('Error on create new User');
		}

		return await user.prepareStorageData();
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
}

export default AccountController;
