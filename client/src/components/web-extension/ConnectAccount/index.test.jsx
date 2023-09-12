import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { isPopupMode, newTab } from '../../../helpers/extension/tab';
import ConnectAccount from './';

afterEach(cleanup);

jest.mock('../../../helpers/extension/tab', () => ({
	newTab: jest.fn(),
	isPopupMode: jest.fn(),
}));

test('Should show connect options', () => {
	isPopupMode.mockReturnValue(false);
	const { getByText } = render(<ConnectAccount />);

	expect(getByText(/Connect Ledger/i).textContent).toBe('Connect Ledger');
	fireEvent.click(getByText(/Connect Ledger/i));
	expect(useNavigate()).toHaveBeenCalledWith('/connectDevice');
});

test('Should open new tab if extension mode', () => {
	isPopupMode.mockReturnValue(true);
	const { getByText } = render(<ConnectAccount />);

	expect(getByText(/Connect Ledger/i).textContent).toBe('Connect Ledger');
	fireEvent.click(getByText(/Connect Ledger/i));
	expect(newTab).toHaveBeenCalledWith({ route: '/connectDevice' });
});
