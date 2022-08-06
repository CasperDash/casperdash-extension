import { useSelector } from 'react-redux';
import { User, KeyFactory } from 'casper-storage';
import { renderHook } from '@testing-library/react-hooks';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import useCreateUser from './useCreateUser';

jest.mock('casper-storage', () => ({
	...jest.requireActual('casper-storage'),
	User: jest.fn(),
}));
jest.mock('@cd/actions/userActions', () => ({
	onBindingAuthInfo: jest.fn(),
}));

describe('useCreateUser', () => {
	it('Should return a User creation function once called', () => {
		const { result } = renderHook(() => useCreateUser());

		expect(result.current).toBeTruthy();
		expect(typeof result.current.onCreateNewUser).toBe('function');
	});

	it("Should return undefined when no keyphrase provided", async () => {
		const {
			result: {
				current: { onCreateNewUser },
			},
		} = renderHook(() => useCreateUser());
		const result = await onCreateNewUser();

		expect(result).toBeUndefined();
	});

	it('Should return undefined when no password provided', async () => {
		useSelector.mockReturnValueOnce('abc def xxx');
		const {
			result: {
				current: { onCreateNewUser },
			},
		} = renderHook(() => useCreateUser());
		const result = await onCreateNewUser();

		expect(result).toBeUndefined();
	});

	it('Should return undefined when password provided is not strong enough', async () => {
		useSelector.mockReturnValueOnce('abc def xxx');
		const {
			result: {
				current: { onCreateNewUser },
			},
		} = renderHook(() => useCreateUser());
		const result = await onCreateNewUser('abc123');

		expect(result).toBeUndefined();
	});

	it('Should call `onBindingAuthInfo` when creating new User successfully', async () => {
		User.mockReturnValueOnce({
			setHDWallet: jest.fn(),
			addWalletAccount: jest.fn().mockImplementation(() => ({
				getPublicAddress: jest.fn().mockReturnValueOnce('this-is-public-key'),
			})),
			getPasswordHashingOptions: jest.fn(),
			serialize: jest.fn(),
		});
		const keyphrase = KeyFactory.getInstance().generate();
		// Need to manually create salt info because jest env doesn't honor some internal casper API
		const saltArray = [154, 122, 96, 217, 57, 201, 196, 63, 217, 99, 148, 81, 232, 180, 58, 50];
		useSelector.mockReturnValueOnce(keyphrase);
		const {
			result: {
				current: { onCreateNewUser },
			},
		} = renderHook(() => useCreateUser());

		await onCreateNewUser('Abc@QWZ123abAxcvx1!', {
			passwordOptions: {
				salt: new Uint8Array(saltArray),
			},
		});

		expect(onBindingAuthInfo).toHaveBeenCalledTimes(1);
		expect(onBindingAuthInfo).toHaveBeenCalledWith('this-is-public-key', expect.anything());
	});
});
