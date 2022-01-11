import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import * as redux from 'react-redux';
import { pushStakeToLocalStorage } from '../../../actions/stakeActions';
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

jest.mock('../../../actions/stakeActions', () => {
	return {
		__esModule: true,
		pushStakeToLocalStorage: jest.fn(),
	};
});

jest.mock('../../hooks/useConfirmDeploy', () => {
	return {
		__esModule: true,
		useConfirmDeploy: jest.fn(() => {
			return {
				executeDeploy: jest.fn(() => {
					return {
						deployHash: '0x123',
						signedDeploy: {
							deploy: {
								header: {
									timestamp: 1234,
								},
							},
						},
					};
				}),
				isDeploying: false,
			};
		}),
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

test('Should show confirm section', () => {
	useLocation.mockReturnValue({
		state: {},
	});
	spyOnUseSelector.mockReturnValue('0x00');
	const { getByText } = render(<Confirm />);
	expect(getByText('Validator').textContent).toBe('Validator');
	expect(getByText('Amount').textContent).toBe('Amount');
	expect(getByText('Network Fee').textContent).toBe('Network Fee');
	expect(getByText('Delegate').textContent).toBe('Delegate');
});

test('Should confirm delegate action', async () => {
	useLocation.mockReturnValue({
		state: {
			stake: {
				validator: '0x123',
				amount: 1,
				fee: 0.001,
				action: 'delegate',
			},
		},
	});
	useNavigate.mockReturnValue(jest.fn());
	spyOnUseSelector.mockReturnValue('0x00');
	const { container, queryAllByText } = render(<Confirm />);
	const confirmBtn = container.querySelector('.btn-primary');
	expect(queryAllByText('Delegate').length).toBe(1);
	await fireEvent.click(confirmBtn);
	expect(pushStakeToLocalStorage).toHaveBeenCalledWith('0x00', {
		amount: 1,
		entryPoint: 'delegate',
		fee: 0.001,
		fromAddress: '0x00',
		validator: '0x123',
		deployHash: '0x123',
		status: 'pending',
		timestamp: 1234,
	});
});

test('Should confirm undelegate action', async () => {
	useLocation.mockReturnValue({
		state: {
			stake: {
				validator: '0x123',
				amount: 1,
				fee: 0.001,
				action: 'undelegate',
			},
		},
	});
	useNavigate.mockReturnValue(jest.fn());
	spyOnUseSelector.mockReturnValue('0x00');
	const { container, queryAllByText } = render(<Confirm />);
	const confirmBtn = container.querySelector('.btn-primary');
	expect(queryAllByText('Undelegate').length).toBe(1);
	await fireEvent.click(confirmBtn);
	expect(pushStakeToLocalStorage).toHaveBeenCalledWith('0x00', {
		amount: 1,
		entryPoint: 'undelegate',
		fee: 0.001,
		fromAddress: '0x00',
		validator: '0x123',
		deployHash: '0x123',
		status: 'pending',
		timestamp: 1234,
	});
});
