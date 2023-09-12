import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Grid from './index';

// eslint-disable-next-line
jest.mock('@cd/common/NoData', () => () => <div>No data</div>);

const setup = (props = {}) => {
	return render(
		<Grid
			{...props}
			metadata={{
				left: [
					{
						key: 'symbol',
						type: 'primary',
					},
					{
						key: 'balance.displayValue',
						type: 'secondary',
						format: 'number',
					},
				],
				right: [
					{
						key: 'totalPrice',
						type: 'primary',
						format: 'currency',
					},
					{
						key: 'price',
						type: 'secondary',
						format: 'currency',
					},
				],
			}}
			onRowClick={jest.fn()}
		/>,
	);
};

afterEach(cleanup);

describe('Grid', () => {
	const sharedProps = {
		symbol: 'CSPR',
		address: 'CSPR',
		icon: '/assets/images/token-icons/cspr.png',
		balance: {
			displayValue: 0,
		},
		price: 0.03772368,
		transferFee: 0.1,
		minAmount: 2.5,
	};
	it('Should render NoData component when data is not ready', () => {
		const { queryByText } = setup();
		expect(queryByText(/No data/i)).toBeInTheDocument();
	});

	it('Should show 0 when User doesnt have any CSPR in wallet', () => {
		const { getByTestId } = setup({
			data: [
				{
					...sharedProps,
					totalPrice: 0,
				},
			],
		});

		expect(getByTestId('CSPR-balance.displayValue').textContent).toBe('0 ');
		expect(getByTestId('CSPR-totalPrice').textContent).toBe('$0.00 ');
		expect(getByTestId('CSPR-price').textContent).toBe('$0.04 ');
	});

	it('Should show value and amount when User has some balances in wallet', () => {
		const { getByTestId } = setup({
			data: [
				{
					...sharedProps,
					totalPrice: 3.77,
					balance: {
						displayValue: 100,
					},
				},
			],
		});

		expect(getByTestId('CSPR-symbol').textContent).toBe('CSPR ');
		expect(getByTestId('CSPR-balance.displayValue').textContent).toBe('100 ');
		expect(getByTestId('CSPR-totalPrice').textContent).toBe('$3.77 ');
		expect(getByTestId('CSPR-price').textContent).toBe('$0.04 ');
	});
});
