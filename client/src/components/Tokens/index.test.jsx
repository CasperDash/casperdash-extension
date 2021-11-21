/* eslint-disable react/no-multi-comp */
import React from 'react';
import * as redux from 'react-redux';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Token from './index';

//Set up
jest.mock('../../actions/tokensActions', () => {
	//Mock the default export and named export 'foo'
	return {
		__esModule: true,
		addCustomTokenAddressToLocalStorage: () => {},
		getTokenAddressFromLocalStorage: () => {},
		fetchTokensInfoWithBalance: () => {},
	};
});

jest.mock('../Common/Layout/HeadingComponent/Heading', () => {
	return {
		__esModule: true,
		default: () => {
			return <div />;
		},
	};
});

jest.mock('../Common/SendReceive', () => {
	return {
		__esModule: true,
		SendReceiveSection: () => {
			return <div />;
		},
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

// Test

test('Show no token message', () => {
	spyOnUseSelector.mockReturnValue([]);

	const { getByText } = render(<Token />);
	expect(getByText(/You do not have any Tokens yet./i).textContent).toBe('You do not have any Tokens yet.');
});

test('Have Tokens', () => {
	spyOnUseSelector.mockReturnValue([
		{ symbol: 'CDAS', address: 'cdashaddress' },
		{ symbol: 'BTC', address: 'btcaddress' },
	]);

	const { getByText } = render(<Token />);
	expect(getByText(/cdashaddress/i).textContent).toBe('cdashaddress');
	expect(getByText(/BTC/i).textContent).toBe('BTC');
});

test('Add new token, add token modal should be shown', () => {
	spyOnUseSelector.mockReturnValue([]);

	const { getByText, queryByText, queryAllByText, container } = render(<Token />);
	fireEvent.click(getByText('+ Add Token'));
	expect(getByText(/Token Address/i).textContent).toBe('Token Address');
	fireEvent.click(queryAllByText('Close')[0]);

	expect(container.querySelector('.cd_add_token_modal_content')).toBe(null);
});
