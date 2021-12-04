import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Form from './Form';
afterEach(cleanup);

jest.mock('./UnDelegateForm', () => {
	return {
		__esModule: true,
		default: () => <form>UnDelegate Form</form>,
	};
});

jest.mock('./DelegateForm', () => {
	return {
		__esModule: true,
		default: () => <form>Delegate Form</form>,
	};
});

describe('Form', () => {
	test('When having default validator, showing undelegate form', () => {
		const defaultValidator = {};
		const { debug, queryAllByText } = render(<Form defaultValidator={defaultValidator} />);
		expect(queryAllByText('UnDelegate Form')[0].textContent).toBe('UnDelegate Form');
	});

	test('When not having default validator, showing delegate form', () => {
		const { debug, queryAllByText } = render(<Form />);
		expect(queryAllByText('Delegate Form')[0].textContent).toBe('Delegate Form');
	});
});
