import { User, EncryptionType } from 'casper-storage';
import UserService from '@cd/services/UserService';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';

const encryptionType = EncryptionType.Ed25519;

class AccountController {
	userService;
	constructor(appStore) {
		this.appStore = appStore;
	}

	getCurrentUser = () => this.appStore.getState()?.user ?? undefined;

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

			// this.appStore.push({user})
			user.initialize(keyphrase);

			this.userService = user;
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
		const user = this.appStore.getState().user;
		if (!user) {
			throw Error('Cant find user');
		}
		const wallet = await user.getWalletAccount(0);
		return await wallet.getPublicKey();
	};
}

export default AccountController;
