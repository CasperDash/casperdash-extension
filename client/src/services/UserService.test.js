import { User } from 'casper-storage';
import { Keys } from 'casper-js-sdk';
import UserInstance, { UserService } from './UserService';

jest.mock('casper-storage', () => ({
	...jest.requireActual('casper-storage'),
	User: jest.fn(),
}));

jest.mock('casper-js-sdk', () => ({
	...jest.requireActual('casper-js-sdk'),
	Keys: {
		Ed25519: jest.fn(),
	},
}));

describe('UserInstance', () => {
	it('Should be an instance of UserService class', () => {
		expect(UserInstance instanceof UserService).toBeTrue;
	});

	it("Should return undefined when there's no User assigned", () => {
		const user = UserInstance.instance;
		expect(user).toBeUndefined();
	});

	describe('When found User instance', () => {
		it('Should generate a key pair', async () => {
			User.mockReturnValueOnce({
				getWalletAccount: jest.fn().mockImplementation(() => ({
					getPublicKeyByteArray: jest.fn().mockResolvedValue('abc'),
					getPrivateKeyByteArray: jest.fn().mockReturnValue('def'),
				})),
			});

			Keys.Ed25519.parseKeyPair = jest.fn().mockReturnValue('hello');
			const mockUser = User();
			UserInstance.instance = mockUser;

			const result = await UserInstance.generateKeypair();
			expect(result).toBe('hello');
		});

		it('Should return undefined when found any error', async () => {
			User.mockReturnValueOnce({
				getWalletAccount: jest.fn().mockImplementation(() => ({
					getPublicKeyByteArray: jest.fn().mockResolvedValue('abc'),
					getPrivateKeyByteArray: jest.fn().mockReturnValue('def'),
				})),
			});

			Keys.Ed25519 = jest.fn().mockReturnValue(undefined);
			const mockUser = User();
			UserInstance.instance = mockUser;

			expect(await UserInstance.generateKeypair()).toBe(undefined);
		});
	});
});
