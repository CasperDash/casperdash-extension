import { KeyFactory, User, EncryptionType } from 'casper-storage';
import { cleanup } from '@testing-library/react';
import { Keys } from 'casper-js-sdk';
import UserInstance, { UserService } from './UserService';

jest.mock('casper-storage', () => ({
	...jest.requireActual('casper-storage'),
	User: jest.fn(),
}));

jest.mock('casper-js-sdk', () => ({
	...jest.requireActual('casper-js-sdk'),
	Keys: {
		Ed25519: {
			parseKeyPair: jest.fn(),
		},
	},
}));

describe('UserInstance', () => {
	it('Should be an instance of UserService class', () => {
		const user = new UserInstance();
		expect(user instanceof UserService).toBeTrue;
	});

	describe('When passing a new User from casper-storage', () => {
		let user;

		beforeEach(() => {
			User.mockReturnValueOnce({
				setHDWallet: jest.fn(),
				addWalletAccount: jest.fn().mockImplementation(() => ({
					getPublicKey: jest.fn().mockReturnValueOnce('this-is-public-key'),
				})),
				getPasswordHashingOptions: jest.fn().mockReturnValue('this-is-password-hash-options'),
				serialize: jest.fn().mockReturnValue('this-is-user-info'),
				getWalletAccount: jest.fn().mockImplementation(() => ({
					getPublicKey: jest.fn().mockReturnValueOnce('this-is-public-key'),
					getEncryptionType: jest.fn().mockReturnValue(EncryptionType.Ed25519),
					getPublicKeyByteArray: jest.fn().mockReturnValue([1, 2, 3, 4, 5, 6]),
					getPrivateKeyByteArray: jest.fn().mockReturnValue([1, 2, 3, 4, 5]),
				})),
				getHDWallet : jest.fn().mockImplementation(() => []),
			});
			const opts = {
				encryptionType: EncryptionType.Ed25519,
				currentWalletIndex: 0,
			};
			user = new UserService(new User('6U71C@Wp7r5XtFtQzYrW5iKFT6!'), opts);

			const keyphrase = KeyFactory.getInstance().generate();
			user.initialize(keyphrase);
		});

		afterEach(cleanup);

		it('Should return public key', async () => {
			const result = await user.getPublicKey();

			expect(result).toBe('this-is-public-key');
		});

		it('Should return UserInfoHash', async () => {
			const result = await user.getUserInfoHash();
			const hash = JSON.stringify('this-is-password-hash-options');
			expect(result).toBeTruthy;
			expect(result.userHashingOptions).toEqual(hash);
			expect(result.userInfo).toEqual('this-is-user-info');
		});

		it('Should return storage data', async () => {
			const result = await user.prepareStorageData();
			const hash = JSON.stringify('this-is-password-hash-options');

			expect(result).toBeTruthy;
			expect(result).toEqual({
				publicKey: 'this-is-public-key',
				userDetails: {
					userHashingOptions: hash,
					userInfo: 'this-is-user-info',
					currentWalletIndex: 0,
				},
			});
		});

		it('Should generate an AsymmetricKey keypair', async () => {
			const mockParseKeypair = jest.fn().mockImplementation((pubKey, prvKey) => {
				// eslint-disable-next-line
				console.log(`🚀 ~ mockParseKeypair:: `, pubKey, prvKey);
			});
			Keys.Ed25519.parseKeyPair = mockParseKeypair;
			await user.generateKeypair();

			expect(mockParseKeypair).toHaveBeenCalledTimes(1);
			expect(mockParseKeypair).toHaveBeenCalledWith([2, 3, 4, 5, 6], [1, 2, 3, 4, 5]);
		});
	});
});

describe('generateHDWallets', () => {
	const opts = {
		encryptionType: EncryptionType.Ed25519,
		currentWalletIndex: 0,
	};

	function getUserService() {
		const user = new User('6U71C@Wp7r5XtFtQzYrW5iKFT6!');
		const keyphrase = KeyFactory.getInstance().generate();

		const userService = new UserService(user, opts);
		userService.initialize(keyphrase);

		return userService;
	}

	beforeEach(() => {
		User.mockClear();
	});

	describe('When opening accounts modal', () => {
		it('Should return empty array with total is equal to 0', async () => {
			const mockGetHDWallet = jest.fn().mockImplementation(() => []);
			User.mockReturnValueOnce({
				setHDWallet: jest.fn(),
				addWalletAccount: jest.fn().mockImplementation(() => ({
					getPublicKey: jest.fn().mockReturnValueOnce('this-is-public-key'),
				})),
				getHDWallet : mockGetHDWallet,
			});
			const userService = getUserService();

			const generatedWallets = await userService.generateHDWallets(0);

			expect(mockGetHDWallet).toHaveBeenCalledTimes(1);
			expect(generatedWallets).toEqual([]);
		});

		it('Should return wallets with total is equal to 10', async () => {
			const mockAddWalletAccount = jest.fn().mockImplementation(() => ({
				getPublicKey: jest.fn().mockReturnValueOnce('this-is-public-key'),
			}));
			User.mockReturnValueOnce({
				setHDWallet: jest.fn(),
				addWalletAccount: mockAddWalletAccount,
				getHDWallet : jest.fn().mockReturnValueOnce({_derivedWallets: []}).mockReturnValueOnce({_derivedWallets: [
					{_id: 'wallet1'}, 
					{_id: 'wallet2'},
					{_id: 'wallet3'},
					{_id: 'wallet4'},
					{_id: 'wallet5'},
					{_id: 'wallet6'},
					{_id: 'wallet7'},
					{_id: 'wallet8'},
					{_id: 'wallet9'},
					{_id: 'wallet10'},
				]}),
				getWalletAccount: jest.fn().mockImplementation(() => ({
					getPublicKey: jest.fn().mockReturnValueOnce('this-is-public-key'),
					getEncryptionType: jest.fn().mockReturnValue(EncryptionType.Ed25519),
					getPublicKeyByteArray: jest.fn().mockReturnValue([1, 2, 3, 4, 5, 6]),
					getPrivateKeyByteArray: jest.fn().mockReturnValue([1, 2, 3, 4, 5]),
				})),
			});
			const userService = getUserService();
			const generatedWallets = await userService.generateHDWallets(10);

			// 1 time called in constructor.
			expect(mockAddWalletAccount).toHaveBeenCalledTimes(11);
			expect(generatedWallets).toEqual([
				{_id: 'wallet1', "publicKey": "this-is-public-key"}, 
				{_id: 'wallet2', "publicKey": "this-is-public-key"}, 
				{_id: 'wallet3', "publicKey": "this-is-public-key"}, 
				{_id: 'wallet4', "publicKey": "this-is-public-key"}, 
				{_id: 'wallet5', "publicKey": "this-is-public-key"}, 
				{_id: 'wallet6', "publicKey": "this-is-public-key"}, 
				{_id: 'wallet7', "publicKey": "this-is-public-key"}, 
				{_id: 'wallet8', "publicKey": "this-is-public-key"}, 
				{_id: 'wallet9', "publicKey": "this-is-public-key"}, 
				{_id: 'wallet10', "publicKey": "this-is-public-key"}, 
			]);
		});

		it('Should return wallets with total is equal to 10 and current total wallets greater than 10', async () => {
			User.mockReturnValueOnce({
				setHDWallet: jest.fn(),
				addWalletAccount: jest.fn().mockImplementation(() => ({
					getPublicKey: jest.fn().mockReturnValueOnce('this-is-public-key'),
				})),
				getHDWallet : jest.fn().mockImplementationOnce(() => ({_derivedWallets: [
					{_id: 'wallet1'}, 
					{_id: 'wallet2'},
					{_id: 'wallet3'},
					{_id: 'wallet4'},
					{_id: 'wallet5'},
					{_id: 'wallet6'},
					{_id: 'wallet7'},
					{_id: 'wallet8'},
					{_id: 'wallet9'},
					{_id: 'wallet10'},
					{_id: 'wallet11'},
				]})).mockImplementationOnce(() => ({_derivedWallets: [
					{_id: 'wallet1'}, 
					{_id: 'wallet2'},
					{_id: 'wallet3'},
					{_id: 'wallet4'},
					{_id: 'wallet5'},
					{_id: 'wallet6'},
					{_id: 'wallet7'},
					{_id: 'wallet8'},
					{_id: 'wallet9'},
					{_id: 'wallet10'},
				]})),
				getWalletAccount: jest.fn().mockImplementation(() => ({
					getPublicKey: jest.fn().mockReturnValueOnce('this-is-public-key'),
					getEncryptionType: jest.fn().mockReturnValue(EncryptionType.Ed25519),
					getPublicKeyByteArray: jest.fn().mockReturnValue([1, 2, 3, 4, 5, 6]),
					getPrivateKeyByteArray: jest.fn().mockReturnValue([1, 2, 3, 4, 5]),
				})),
			});
			const userService = getUserService();

			const generatedWallets = await userService.generateHDWallets(10);

			expect(generatedWallets).toEqual([]);
		});
	});
});
