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
		Secp256K1: {
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
					getReferenceKey: jest.fn().mockReturnValue('refkey'),
				})),
				getHDWallet: jest.fn().mockReturnValue({ derivedWallets: [{ uid: 'test' }] }),
				getWalletInfo: jest.fn().mockReturnValue({ uid: 'test', isHDWallet: true }),
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
			expect(result).toBeTruthy;
			expect(result).toEqual('this-is-user-info');
		});

		it('Should return storage data', async () => {
			const result = await user.prepareStorageData();

			expect(result).toBeTruthy;
			expect(result).toEqual({
				publicKey: 'this-is-public-key',
				userDetails: {
					connectionType: 'privateKey',
					selectedWallet: {
						descriptor: undefined,
						encryptionType: undefined,
						uid: 'test',
					},
				},
			});
		});

		it('Should generate an AsymmetricKey keypair', async () => {
			const mockParseKeypair = jest.fn().mockImplementation((pubKey, prvKey, originalFormat) => {
				// eslint-disable-next-line
				console.log(`🚀 ~ mockParseKeypair:: `, pubKey, prvKey, originalFormat);
			});
			Keys.Secp256K1.parseKeyPair = mockParseKeypair;
			await user.generateKeypair();

			expect(mockParseKeypair).toHaveBeenCalledTimes(1);
			expect(mockParseKeypair).toHaveBeenCalledWith([2, 3, 4, 5, 6], [1, 2, 3, 4, 5], 'raw');
		});
	});
});
