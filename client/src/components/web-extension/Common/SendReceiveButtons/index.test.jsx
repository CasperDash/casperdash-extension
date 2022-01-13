/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { SendReceive } from './';

afterEach(cleanup);

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockUsedNavigate,
}));

test('Should show send button', () => {
	const { getByText } = render(<SendReceive />);
	expect(getByText('Send').textContent).toBe('Send');
	fireEvent.click(getByText('Send'));
	expect(mockUsedNavigate).toHaveBeenCalledWith('/send', { state: { name: 'Send', token: undefined } });
});

test('Should show receive button', () => {
	const { getByText } = render(<SendReceive />);

	expect(getByText('Receive').textContent).toBe('Receive');
	fireEvent.click(getByText('Receive'));
	expect(mockUsedNavigate).toHaveBeenCalledWith('/receive', { state: { name: 'Receive', token: undefined } });
});
