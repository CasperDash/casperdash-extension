/* eslint-disable react/no-multi-comp */
import React from 'react';
import * as redux from 'react-redux';
import { render, fireEvent, cleanup,act } from '@testing-library/react';
import Token from './index';

//Set up
jest.mock('../../actions/tokensActions', () => {
	//Mock the default export and named export 'foo'
	return {
		__esModule: true,
		addCustomTokenAddressToLocalStorage: () => {},
		getTokenAddressFromLocalStorage: () => {},
		fetchTokensInfoWithBalance: () => {},
		getTokenInfo:()=>({error:{message:'error message'}})
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
		{ symbol: 'CDAS', address: 'cdashaddress',balance:{displayValue:1000} },
		{ symbol: 'BTC', address: 'btcaddress' },
	]).mockReturnValueOnce([
		{ symbol: 'CDAS', address: 'cdashaddress',balance:{displayValue:1000} },
		{ symbol: 'BTC', address: 'btcaddress' },
	]).mockReturnValueOnce([]).mockReturnValueOnce({balance:{displayBalance:2000}});

	const { getByText,queryAllByText } = render(<Token />);
	expect(getByText(/cdashaddress/i).textContent).toBe('cdashaddress');
	expect(getByText(/BTC/i).textContent).toBe('BTC');
	expect(getByText(/1,000/i).textContent).toBe('1,000');
	
});

test('Add new token, add token modal should be shown', () => {
	spyOnUseSelector.mockReturnValue([]);

	const { getByText, queryAllByText, container } = render(<Token />);
	fireEvent.click(getByText('+ Add Token'));
	expect(getByText(/Token Address/i).textContent).toBe('Token Address');
	fireEvent.click(queryAllByText('Close')[0]);

	expect(container.querySelector('.cd_add_token_modal_content')).toBe(null);
});

test('Show error if can not add token',async ()=>{
	spyOnUseSelector.mockReturnValue([]);
	spyOnUseDispatch.mockReturnValue(()=>({error:'error message'}));
	const { getByText } = render(<Token />);
	fireEvent.click(getByText('+ Add Token'));
	await act(async () => {
		/* fire events that update state */
		fireEvent.click(getByText('Add'));
	  });
	expect(getByText(/error message/i).textContent).toBe('error message');
})

test('Close add token modal if successfully add token',async ()=>{
	spyOnUseSelector.mockReturnValue([]);
	spyOnUseDispatch.mockReturnValue(()=>({data:{name:'Casper Dash'}}));
	const { getByText,queryByText } = render(<Token />);
	fireEvent.click(getByText('+ Add Token'));
	await act(async () => {
		/* fire events that update state */
		fireEvent.click(getByText('Add'));
	  });
	expect(queryByText('Add')).toBe(null);
})

test('Set selected token when click on token area',async ()=>{
	spyOnUseSelector.mockReturnValue([
		{ symbol: 'CDAS', address: 'cdashaddress',name:'Casper Dash' },
		{ symbol: 'BTC', address: 'btcaddress',name:'Bitcoin' },
	]);
	const { getByText,queryByText } = render(<Token />);
	fireEvent.click(getByText('BTC'));
	expect(queryByText('btcaddress').textContent).toBe('btcaddress');
})

test('Show error if click on add token without public key',async ()=>{
	spyOnUseSelector.mockReturnValue('');
	const { getByText,queryByText,queryAllByText } = render(<Token />);
	fireEvent.click(getByText('+ Add Token'));
	expect(queryByText('Unlock your Signer!').textContent).toBe('Unlock your Signer!');
	await act(async () => {
		/* fire events that update state */
		fireEvent.click(queryAllByText('Close')[0]);
	  });
	  expect(queryByText('Unlock your Signer!')).toBe(null);
})