import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import DeployDetails from './';

afterEach(cleanup);

test('Should deploy detail info', async () => {
	useLocation.mockReturnValue({
		state: {
			deploy: {
				fromAddress: '12312e21e',
				toAddress: '12312379709810293801',
				amount: '10',
				fee: '0.1',
				timestamp: '2022/01/01',
				deployHash: '2221313215646',
				transferId: '1313215646',
			},
		},
	});
	const { getByText } = render(<DeployDetails />);
	expect(getByText(/Sending address/i).textContent).toBe('Sending address');
	expect(getByText(/12312e21e/i).textContent).toBe('12312e21e');
	expect(getByText(/12312379709810293801/i).textContent).toBe('12312379709810293801');
	expect(getByText('10').textContent).toBe('10');
	expect(getByText(/0.1/i).textContent).toBe('0.1');
	expect(getByText(/2221313215646/i).textContent).toBe('2221313215646');
	expect(getByText('1313215646').textContent).toBe('1313215646');
	expect(getByText(/View in explorer/i).textContent).toBe('View in explorer');
});
