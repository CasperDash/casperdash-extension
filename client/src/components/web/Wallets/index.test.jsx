/* eslint-disable react/no-multi-comp */
import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import Wallet from './index';

jest.mock('../../Common/Layout/HeadingComponent/Heading', () => {
	return {
		__esModule: true,
		default: () => {
			return <div />;
		},
	};
});

jest.mock('../../Common/SendReceive', () => {
	return {
		__esModule: true,
		SendReceiveSection: () => {
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

jest.mock('react-router-dom', () => {
	return {
		__esModule: true,
		Link: () => <div />,
	};
});

jest.mock('../../Common/Layout/Chart', () => {
	return {
		__esModule: true,
		ChartLine: () => <div />,
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

test('Should display account information section', () => {
	spyOnUseSelector
		.mockReturnValue([])
		.mockReturnValueOnce({ _accountHash: 'accounthash' })
		.mockReturnValueOnce('publickey');
	const { getByText } = render(<Wallet />);

	expect(getByText(/Account Info/i).textContent).toBe('Account Info');
	expect(getByText(/Public Key/i).textContent).toBe('Public Key');
	expect(getByText(/Account Hash/i).textContent).toBe('Account Hash');
	expect(getByText(/accounthash/i).textContent).toBe('accounthash');
	expect(getByText(/publickey/i).textContent).toBe('publickey');
});

test('Should display send receive section when click send if have public key', async () => {
	spyOnUseSelector
		.mockReturnValue([])
		.mockReturnValueOnce({ _accountHash: 'accounthash' })
		.mockReturnValueOnce('publickey');
	const { getByText, container } = render(<Wallet />);
	const sendButton = getByText('Send');
	await act(async () => {
		/* fire events that update state */
		fireEvent.click(sendButton);
	});

	expect(container.querySelector('.cd_chart_component').className.includes('active')).toBe(true);
});

test('Should display error when click send if no public key', async () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce({ _accountHash: 'accounthash' }).mockReturnValueOnce('');
	const { getByText, container, queryAllByText } = render(<Wallet />);
	const sendButton = getByText('Send');
	await act(async () => {
		/* fire events that update state */
		fireEvent.click(sendButton);
	});

	expect(container.querySelector('.cd_chart_component').className.includes('active')).toBe(false);
	expect(getByText('Unlock your Signer!').textContent).toBe('Unlock your Signer!');
	fireEvent.click(queryAllByText('Close')[0]);
});

test('Should display account balance', () => {
	spyOnUseSelector
		.mockReturnValue([])
		.mockReturnValueOnce({ _accountHash: 'accounthash', balance: { displayBalance: 99 } })
		.mockReturnValueOnce('publickey');
	const { getByText } = render(<Wallet />);

	expect(getByText(/99/i).textContent).toBe('99 ($0.00)');
});
