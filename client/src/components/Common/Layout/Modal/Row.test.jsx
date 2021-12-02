import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ModalRow from './Row';
afterEach(cleanup);

describe('ModalRow', () => {
	test('Should render custom class', () => {
		const { container } = render(<ModalRow customClass="custom-class" />);
		expect(container.querySelector('.cd_confirm_modal_row').className.includes('custom')).toBe(true);
	});

	test('Should render label and value', () => {
		const { queryAllByText } = render(<ModalRow label="Hello World" value="CSPR" />);
		expect(queryAllByText('Hello World')[0].textContent).toBe('Hello World');
		expect(queryAllByText('CSPR')[0].textContent).toBe('CSPR');
	});
});
