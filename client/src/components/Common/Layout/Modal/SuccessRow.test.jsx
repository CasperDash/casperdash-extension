import React from 'react';
import { render, cleanup } from '@testing-library/react';
import SuccessRow from './SuccessRow';

afterEach(cleanup);

describe('SuccessRow', () => {
	test('Should render SuccessRow with label and value', () => {
		const { queryAllByText } = render(<SuccessRow label="Balance" value="1000" />);
		expect(queryAllByText('Balance')[0].textContent).toBe('Balance');
		expect(queryAllByText('1000')[0].textContent).toBe('1000');
	});

	test('Should render SuccessRow with custom class', () => {
		const { container } = render(<SuccessRow show={true} customClass="custom-class" />);
		expect(container.querySelector('.cd_confirm_modal_row').className.includes('custom-class')).toBe(true);
	});
});
