import React from 'react';
import { render, cleanup } from '@testing-library/react';
import AllTransactionList from './AllTransactionList';

afterEach(cleanup);

test('Should table with columns', () => {
	const { getByText } = render(<AllTransactionList />);
	expect(getByText('name').textContent).toBe('name');
	expect(getByText('type').textContent).toBe('type');
	expect(getByText('transaction hash').textContent).toBe('transaction hash');
	expect(getByText('transfer id').textContent).toBe('transfer id');
	expect(getByText('value').textContent).toBe('value');
	expect(getByText('status').textContent).toBe('status');
	expect(getByText('date').textContent).toBe('date');
});

test('Should table with data', () => {
	const { getByText } = render(
		<AllTransactionList
			transfersDeployList={[
				{
					symbol: 'CDAS',
					deployHash: 'testdeployhash',
					transferId: 'testtransferid',
					amount: 100,
					timestamp: '2020-10-10',
				},
			]}
		/>,
	);
	expect(getByText('CDAS').textContent).toBe('CDAS');
	expect(getByText('testdeployhash').textContent).toBe('testdeployhash ');
	expect(getByText('testtransferid').textContent).toBe('testtransferid');
	expect(getByText('-100').textContent).toBe('-100');
	expect(getByText('pending').textContent).toBe('pending');
	expect(getByText(/10\/10\/20/i).textContent.includes('10/10/20')).toBe(true);
});
