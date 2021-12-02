import React from 'react';
import { render, cleanup } from '@testing-library/react';
import SingleCurrencyRow from './CurrencyModalRow';

afterEach(cleanup);

describe('ModalRow', () => {
	test('Should render MessageModal with amount', () => {
		const { queryAllByText } = render(<SingleCurrencyRow amount={1000} />);
		expect(queryAllByText('1000')[0].textContent).toBe('1000');
	});
});
