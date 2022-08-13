/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import * as redux from 'react-redux';
import { useDeploysWithStatus } from '../../../hooks/useTransferDeploys';
import { TransactionHistory } from './';

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
}));

jest.mock('../../../hooks/useTransferDeploys', () => {
	return {
		__esModule: true,
		useDeploysWithStatus: jest.fn(),
	};
});

test('Should show list of history', () => {
	useDeploysWithStatus.mockReturnValue([
		{ deployHash: 'testkhaskd', timestamp: '2022/01/01', amount: 10, status: 'pending' },
	]);
	spyOnUseSelector.mockReturnValue('test');
	const { getAllByText, getByText, container } = render(<TransactionHistory symbol="CSPR" />);

	expect(getAllByText(/Pending/i)[0]).toBeInTheDocument();
	expect(getByText(/Completed/i)).toBeInTheDocument();
	expect(getByText(/Failed/i)).toBeInTheDocument();
	expect(getByText(/All/i)).toBeInTheDocument();
	expect(getByText(/testk/i)).toBeInTheDocument();
	expect(getByText('10 CSPR')).toBeInTheDocument();
	expect(getAllByText(/pending/i)[1]).toBeInTheDocument();
	fireEvent.click(container.querySelector('.cd_we_item'));
	expect(mockUsedNavigate).toHaveBeenCalled();
});

test('Should update active tab if click on status filter', async () => {
	useDeploysWithStatus.mockReturnValue([
		{ deployHash: 'testkhaskd', timestamp: '2022/01/01', amount: 10, status: 'pending' },
	]);
	spyOnUseSelector.mockReturnValue('test');
	const { getByText, container } = render(<TransactionHistory symbol="CSPR" />);

	await fireEvent.click(getByText(/Completed/i));
	expect(container.querySelector('.active').textContent).toBe('Completed');
});
