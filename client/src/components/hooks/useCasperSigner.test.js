import React, { useState } from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { useSelector } from 'react-redux';
import useCasperSigner from './useCasperSigner';

afterEach(cleanup);

jest.mock('react', () => {
	return {
		__esModule: true,
		...jest.requireActual('react'),
		useCallback: jest.fn(),
		useState: jest.fn(),
		useEffect: jest.fn(),
	};
});

jest.mock('react-bootstrap', () => {
	return {
		__esModule: true,
		...jest.requireActual('react'),
		Button: ({ children }) => <div>{children}</div>,
	};
});

jest.mock('../../services/casperServices', () => {
	return {
		connectCasperSigner: jest.fn(),
	};
});

test('Should show connect casper button', async () => {
	useState.mockReturnValue([{}, {}]);
	useSelector.mockReturnValue('');
	const { ConnectSignerButton } = useCasperSigner();
	const { getByText } = render(<ConnectSignerButton />);
	expect(getByText('Connect Casper').textContent).toBe('Connect Casper');
	fireEvent.click(getByText('Connect Casper'));
});
