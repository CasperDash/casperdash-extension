import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { validateTransferForm } from '../../../helpers/validator';
import SendForm from './SendForm';

afterEach(cleanup);

jest.mock('../../../helpers/validator', () => ({
	validateTransferForm: jest.fn(),
}));

test('Should show SendForm ', async () => {
	useLocation.mockReturnValue({ state: {} });
	validateTransferForm.mockReturnValue({});
	useSelector
		.mockReturnValue({})
		.mockReturnValueOnce([])
		.mockReturnValueOnce({ balance: { displayBalance: 0 } });
	const { getByText, container } = render(<SendForm />);
	expect(getByText('Assets').textContent).toBe('Assets');
	expect(getByText('Transfer Amount').textContent).toBe('Transfer Amount');
	expect(getByText('Receiving Address').textContent).toBe('Receiving Address');
	const confirmBtn = getByText('Max');
	await fireEvent.click(confirmBtn);

	expect(container.querySelector("input[name='sendAmount']").value).toBe('0');
});
