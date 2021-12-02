import React from 'react';
import { render, cleanup } from '@testing-library/react';
import CurrencyModalRow from './CurrencyModalRow';

afterEach(cleanup);

describe('ModalRow', () => {
	test('Should render MessageModal with label, amount and currency', () => {
		const { queryAllByText } = render(
			<CurrencyModalRow show={true} label="Balance" amount={1000} currency="CSPR" />,
		);
		expect(queryAllByText('Balance')[0].textContent).toBe('Balance');
		expect(queryAllByText('1000')[0].textContent).toBe('1000 CSPR');
	});
});
