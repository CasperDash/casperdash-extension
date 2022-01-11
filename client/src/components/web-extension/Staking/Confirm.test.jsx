import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import * as redux from 'react-redux';
import { Confirm } from './Confirm';
import { useLocation, useNavigate } from 'react-router-dom';

afterEach(cleanup);
let spyOnUseSelector;
let spyOnUseDispatch;
let mockDispatch;

jest.mock('react-router-dom', () => {
	return {
		__esModule: true,
		useLocation: jest.fn(),
		useNavigate: jest.fn(),
	};
});
beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSelector = jest.spyOn(redux, 'useSelector');
	// Mock useDispatch hook
	spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
	// Mock dispatch function returned from useDispatch
	mockDispatch = jest.fn();
	spyOnUseDispatch.mockReturnValue(mockDispatch);
});

test('Should show transaction info', () => {
	useLocation.mockReturnValue({
		state: {},
	});
	spyOnUseSelector.mockReturnValue('0x00');
	const { getByText } = render(<Confirm show />);
	expect(getByText('Validator').textContent).toBe('Validator');
	expect(getByText('Amount').textContent).toBe('Amount');
	expect(getByText('Network Fee').textContent).toBe('Network Fee');
	expect(getByText('Delegate').textContent).toBe('Delegate');
});
