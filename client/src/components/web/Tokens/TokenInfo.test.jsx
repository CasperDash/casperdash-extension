import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { TokenInfo } from './TokenInfo';

afterEach(cleanup);

test('Display token information', () => {
	const selectedToken = {
		name: 'CDAS',
		symbol: 'Casper Dash',
		address: 'casperdashaddress',
		total_supply: { displayValue: 100 },
	};
	const { getByText } = render(<TokenInfo selectedToken={selectedToken} />);
	expect(getByText(/CDAS/i).textContent).toBe('CDAS');
	expect(getByText(/Casper Dash/i).textContent).toBe('Casper Dash');
	expect(getByText(/casperdashaddress/i).textContent).toBe('casperdashaddress');
	expect(getByText(/100/i).textContent).toBe('100');
});
