/* eslint-disable react/no-multi-comp */
import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import History from './index';

jest.mock('../../Common/Layout/HeadingComponent/Heading', () => {
	return {
		__esModule: true,
		default: () => {
			return <div />;
		},
	};
});

jest.mock('../../Common/Layout/TransactionList/AllTransactionList', () => {
	return {
		__esModule: true,
		default: () => {
			return <div />;
		},
	};
});

jest.mock('../../hooks/useTransferDeploys', () => {
	return {
		__esModule: true,
		useDeploysWithStatus: () => {},
	};
});
jest.mock('../../../selectors/tokens', () => {
	//Mock the default export and named export 'foo'
	return {
		__esModule: true,
		getMassagedTokenData: () => {},
		getTokensAddressList: () => {},
	};
});

jest.mock('../../../actions/tokensActions', () => {
	//Mock the default export and named export 'foo'
	return {
		__esModule: true,
		fetchTokensInfoWithBalance: () => {},
	};
});

afterEach(cleanup);
let spyOnUseSelector;
let spyOnUseDispatch;
let mockDispatch;
beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSelector = jest.spyOn(redux, 'useSelector');
	// Mock useDispatch hook
	spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
	// Mock dispatch function returned from useDispatch
	mockDispatch = jest.fn();
	spyOnUseDispatch.mockReturnValue(mockDispatch);
});

test('Should display All Transactions button', () => {
	spyOnUseSelector.mockReturnValue([]);
	const { getByText } = render(<History />);

	expect(getByText(/All Transactions/i).textContent).toBe('All Transactions');
});

test('Should display cspr balance', () => {
	spyOnUseSelector
		.mockReturnValue([])
		.mockReturnValueOnce([{ address: 'CSPR', symbol: 'CSPR', balance: { displayValue: 999 } }]);
	const { getByText } = render(<History />);

	expect(getByText(/999/i).textContent).toBe('999');
	expect(getByText(/CSPR/i).textContent).toBe('CSPR');
});

test('Should display all token in token list', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce([
		{ symbol: 'CDAS', address: 'casperdashaddress' },
		{ symbol: 'CBTC', address: 'btcaddress' },
	]);
	const { getByText } = render(<History />);

	expect(getByText(/CDAS/i).textContent).toBe('CDAS');
	expect(getByText(/CBTC/i).textContent).toBe('CBTC');
});

test('Should show history of token when token was selected', async () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce([
		{ symbol: 'CDAS', address: 'casperdashaddress' },
		{ symbol: 'CBTC', address: 'btcaddress' },
	]);

	const { getByText, container } = render(<History />);
	expect(getByText(/CDAS/i).textContent).toBe('CDAS');

	await act(async () => {
		fireEvent.click(getByText(/CDAS/i));
	});
	expect(container.querySelector('.cd_all_currency_content').className.includes('active')).toBe(false);
});

test('Should set selected token info equal empty if click on All Transactions', async () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce([
		{ symbol: 'CDAS', address: 'casperdashaddress' },
		{ symbol: 'CBTC', address: 'btcaddress' },
	]);

	const { getByText, container } = render(<History />);

	await act(async () => {
		fireEvent.click(getByText(/CDAS/i));
	});
	await act(async () => {
		fireEvent.click(getByText(/All Transactions/i));
	});
	expect(container.querySelector('.cd_all_currency_content').className.includes('active')).toBe(true);
});
