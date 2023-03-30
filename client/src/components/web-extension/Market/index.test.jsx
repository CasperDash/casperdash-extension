/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { useSelector } from 'react-redux';
import Market from './';

afterEach(cleanup);

jest.mock('../Common/TransactionHistory', () => ({ TransactionHistory: () => <div /> }));
jest.mock('../../Common/Layout/Chart', () => ({ ChartLine: () => <div /> }));

test('Should display market info', async () => {
	useSelector.mockReturnValue().mockReturnValueOnce([]).mockReturnValueOnce(10).mockReturnValueOnce({
		percent_change_24h: 10,
		market_cap: 10000,
		volume_24h: 200,
		total_supply: 3000000,
		circulating_supply: 150000,
	});
	const { getByText } = render(<Market />);
	expect(getByText('Casper (CSPR)').textContent).toBe('Casper (CSPR)');
	expect(getByText('$10').textContent).toBe('$10');
	expect(getByText('$10,000.00').textContent).toBe('$10,000.00');
	expect(getByText('$200.00').textContent).toBe('$200.00');
	expect(getByText('3,000,000').textContent).toBe('3,000,000');
	expect(getByText('150,000').textContent).toBe('150,000');
});

test('Should display percentage down', () => {
	useSelector.mockReturnValue().mockReturnValueOnce([]).mockReturnValueOnce(10).mockReturnValueOnce({
		percent_change_24h: -10,
	});
	const { getByText, container } = render(<Market />);

	expect(getByText(/-10/).textContent).toBe('-10%');
	expect(Boolean(container.querySelector('.down'))).toBe(true);
});

test('Should display default value if no data ', () => {
	useSelector.mockReturnValue().mockReturnValueOnce([]).mockReturnValueOnce(10).mockReturnValueOnce({});
	const { queryAllByText } = render(<Market />);

	expect(queryAllByText('$0.00').length).toBe(2);
});
