import { useSelector } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import useCreateUser from './useCreateUser';

jest.mock('casper-storage', () => ({
	...jest.requireActual('casper-storage'),
	User: jest.fn(),
}));
jest.mock('@cd/actions/userActions', () => ({
	onBindingAuthInfo: jest.fn(),
}));
jest.mock('@cd/hooks/useServiceWorker', () => ({
	...jest.requireActual('@cd/hooks/useServiceWorker'),
	createUserServiceSW: jest.fn(),
}));
jest.mock('@cd/actions/createWalletActions', () => ({
	...jest.requireActual('@cd/actions/createWalletActions'),
	resetWalletCreation: jest.fn(),
}));

describe('useCreateUser', () => {
	it('Should return a User creation function once called', () => {
		const { result } = renderHook(() => useCreateUser());

		expect(result.current).toBeTruthy();
		expect(typeof result.current.onCreateNewUser).toBe('function');
	});

	it('Should return undefined when no keyphrase provided', async () => {
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
});
