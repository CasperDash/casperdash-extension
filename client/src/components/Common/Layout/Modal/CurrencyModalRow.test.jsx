import React from 'react';
import { render, cleanup } from '@testing-library/react';
import CurrencyModalRow from './CurrencyModalRow';

afterEach(cleanup);

describe('CurrencyModalRow', () => {
	test('Should render CurrencyModalRow with label, amount and currency', () => {
		const { queryAllByText } = render(
			<CurrencyModalRow show={true} label="Balance" amount={1000} currency="CSPR" />,
		);
		expect(queryAllByText('Balance')[0].textContent).toBe('Balance');
		expect(queryAllByText('1000')[0].textContent).toBe('1000 CSPR');
	});

	test('Should render CurrencyModalRow with custom class', () => {
		const { container } = render(<CurrencyModalRow show={true} customClass="custom-class" />);
		expect(container.querySelector('.cd_confirm_modal_row').className.includes('custom-class')).toBe(true);
	});
});
