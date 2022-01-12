/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import * as redux from 'react-redux';
import { SearchValidator } from './';

afterEach(cleanup);
let spyOnUseSelector;
let spyOnUseDispatch;
let mockDispatch;
beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSelector = jest.spyOn(redux, 'useSelector');
	spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
	// Mock dispatch function returned from useDispatch
	mockDispatch = jest.fn();
	spyOnUseDispatch.mockReturnValue(mockDispatch);
});

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockUsedNavigate,
	useLocation: jest.fn(),
}));

// jest.mock('../../Common/Grid', () => ({
// 	__esModule: true,
// 	default: () => <div />,
// }));

test('Should show validator list', () => {
	spyOnUseSelector.mockReturnValue([
		{ public_key: 'testkhaskd', bidInfo: { bid: { delegation_rate: 10, staked_amount: 1000000000 } } },
	]);
	useLocation.mockReturnValue({ state: {} });
	const { getByText, container } = render(<SearchValidator />);

	expect(getByText('Validator').textContent).toBe('Validator');
	expect(getByText('Validator List (1)').textContent).toBe('Validator List (1)');
	expect(getByText('testk').textContent).toBe('testk');
	expect(getByText(/10%*/i).textContent).toBe('10.00% Fee');
	expect(getByText(/1 CSPR/i).textContent).toBe('1 CSPR');
	fireEvent.click(container.querySelector('.cd_we_item'));
	expect(mockUsedNavigate).toHaveBeenCalled();
});

test('Should update search box ', async () => {
	spyOnUseSelector.mockReturnValue([
		{ public_key: 'testkhaskd', bidInfo: { bid: { delegation_rate: 10, staked_amount: 1000000000 } } },
		{ public_key: 'test', bidInfo: { bid: { delegation_rate: 11, staked_amount: 1000000000000 } } },
	]);
	useLocation.mockReturnValue({ state: {} });
	const { getByText, getByPlaceholderText } = render(<SearchValidator />);

	expect(getByText('Validator List (2)').textContent).toBe('Validator List (2)');
	expect(getByText('test').textContent).toBe('test');
	expect(getByText(/11%*/i).textContent).toBe('11.00% Fee');
	expect(getByText(/1,000 CSPR/i).textContent).toBe('1,000 CSPR');
	const searchInput = getByPlaceholderText(/Enter validator/i);
	await fireEvent.change(searchInput, { target: { value: 'search' } });
	expect(searchInput.value).toBe('search');
});
