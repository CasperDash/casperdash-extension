import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Table from './Table';

afterEach(cleanup);

test('Should display delegations', async () => {
	const stakingDeployList = [
		{
			validator: '0x123',
			pendingAmount: '',
			stakedAmount: 10,
		},
	];
	const { queryAllByText } = render(<Table stakingDeployList={stakingDeployList} />);
	expect(queryAllByText('0x123')[0].textContent).toBe('0x123 ');
});

test('Should display empty list', async () => {
	const stakingDeployList = [];
	const { queryAllByText } = render(<Table stakingDeployList={stakingDeployList} />);
	expect(
		queryAllByText(
			'You do not have any delegations yet. Stake CSPR, earn rewards and help Capser become more secure!',
		)[0].textContent,
	).toBe('You do not have any delegations yet. Stake CSPR, earn rewards and help Capser become more secure!');
});
