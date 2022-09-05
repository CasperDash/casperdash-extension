import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { getCurrentUserSW } from '@cd/components/hooks/useServiceWorker';
import Send from './';

jest.mock('@cd/hooks/useServiceWorker', () => ({
	...jest.requireActual('@cd/hooks/useServiceWorker'),
	getCurrentUserSW: jest.fn(),
}));

beforeEach(() => {
	getCurrentUserSW.mockResolvedValue({ user: 'demo' });
});
afterEach(cleanup);

test('Should show input screen', async () => {
	useLocation.mockReturnValue({ state: {} });

	const { getByText } = render(<Send />);
	expect(getByText('Assets').textContent).toBe('Assets');
	expect(getByText('Transfer Amount').textContent).toBe('Transfer Amount');
	expect(getByText('Receiving Address').textContent).toBe('Receiving Address');
});

test('Should show confirm screen', async () => {
	useLocation.mockReturnValue({ state: { token: {} }, hash: '#confirm' });

	const { getByText } = render(<Send />);
	expect(getByText('Asset').textContent).toBe('Asset');
	expect(getByText('Transfer Amount').textContent).toBe('Transfer Amount');
	expect(getByText('Receiving Address').textContent).toBe('Receiving Address');
});
