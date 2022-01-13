import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ConnectDevice from './ConnectDevice';

afterEach(cleanup);
const mockLoadMoreKeys = jest.fn();

jest.mock('react-toastify');

jest.mock('../../hooks/useLedger', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation(() => {
		return {
			loadMoreKeys: mockLoadMoreKeys,
		};
	}),
}));

jest.mock('../../../helpers/validator', () => ({
	isValidPublicKey: jest.fn(),
}));

test('Should show connect ledger button', async () => {
	mockLoadMoreKeys.mockReturnValue([{ publicKey: 'testKey' }]);
	const { getByText } = render(<ConnectDevice />);

	expect(getByText(/Connect a hardware wallet/i).textContent).toBe('Connect a hardware wallet');
	expect(getByText(/Connect Ledger/i).textContent).toBe('Connect Ledger');
	await fireEvent.click(getByText(/Connect Ledger/i));
	expect(toast.loading).toHaveBeenCalled();
	expect(toast.update).toHaveBeenCalled();
});

test('Should show keys and load more button', async () => {
	useSelector.mockReturnValue([
		{ publicKey: 'testKey', balance: { displayBalance: 10 } },
		{ publicKey: '02123979', balance: { displayBalance: 20 }, isLoading: true },
	]);
	const { getByText } = render(<ConnectDevice />);

	expect(getByText(/testKey/i).textContent).toBe('testKey ');
	expect(getByText(/10 CSPR/i).textContent).toBe('10 CSPR');
	expect(getByText(/Load More/i).textContent).toBe('Load More');
	fireEvent.click(getByText(/testKey/i));
	expect(useNavigate()).toHaveBeenCalled();
});
