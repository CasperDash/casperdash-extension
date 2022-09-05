import React from 'react';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { cleanup, act } from '@testing-library/react';
import * as reactRouterDom from 'react-router-dom';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import useWithAccount from './useWithAccount';

const setupStore = (data) => {
	return configureStore([thunkMiddleware])({
		...data,
	});
};
// eslint-disable-next-line react/display-name
const wrapper =
	(storeData) =>
	({ children }) =>
		<Provider store={storeData}>{children}</Provider>;

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: jest.fn(),
}));

const { useNavigate } = reactRouterDom;

jest.mock('react', () => ({
	...jest.requireActual('react'),
	useState: jest.fn(),
	useEffect: (callback) => callback(),
}));

jest.mock('@cd/actions/userActions.utils', () => ({
	getConnectedAccountChromeLocalStorage: jest.fn(),
}));

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
}));

// https://stackoverflow.com/questions/56085458/testing-custom-hook-with-react-hooks-testing-library-throws-an-error

describe('useWithAccount', () => {
	const mockNavigate = jest.fn().mockImplementation((to) => {
		// eslint-disable-next-line
		console.log('Mock navigating to:: ', to);
	});

	beforeEach(() => {
		mockNavigate.mockClear();
		useNavigate.mockImplementation(() => mockNavigate);
	});
	afterEach(cleanup);

	it('Should return nothing', () => {
		getConnectedAccountChromeLocalStorage.mockResolvedValue({
			publicKey: 'abc',
			loginOptions: {
				userHashingOptions: '1',
			},
		});
		const store = setupStore({
			user: {
				publicKey: '1',
			},
		});

		const { result } = renderHook(() => useWithAccount(), { wrapper: wrapper(store) });
		expect(result.current).toEqual(undefined);
	});

	it('Should redirect user back to /connectAccount screen when not found cached User info and no public Key stored', async () => {
		getConnectedAccountChromeLocalStorage.mockResolvedValueOnce(undefined);

		const store = setupStore({
			user: {
				publicKey: '',
			},
		});
		await act(async () => {
			renderHook(() => useWithAccount(), { wrapper: wrapper(store) });
		});

		expect(useNavigate).toHaveBeenCalled();
		expect(mockNavigate).toBeCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith('/connectAccount');
	});

	it('Should redirect user back to /connectAccount screen when cached User has empty loginOptions and no public Key stored', async () => {
		getConnectedAccountChromeLocalStorage.mockResolvedValueOnce({
			loginOptions: {},
			publicKey: '',
		});

		const store = setupStore({
			user: {
				publicKey: '',
			},
		});
		await act(async () => {
			renderHook(() => useWithAccount(), { wrapper: wrapper(store) });
		});

		expect(useNavigate).toHaveBeenCalled();
		expect(mockNavigate).toBeCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith('/connectAccount');
	});

	it('Should redirect user back to /welcomeBack screen when found cached User info with empty public key', async () => {
		getConnectedAccountChromeLocalStorage.mockResolvedValueOnce({
			publicKey: '',
			loginOptions: { userHashingOptions: 'Test' },
		});
		const store = setupStore({
			user: {
				publicKey: '',
			},
		});
		await act(async () => {
			renderHook(() => useWithAccount(), { wrapper: wrapper(store) });
		});

		expect(useNavigate).toHaveBeenCalled();
		expect(mockNavigate).toBeCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith('/welcomeBack');
	});
});
