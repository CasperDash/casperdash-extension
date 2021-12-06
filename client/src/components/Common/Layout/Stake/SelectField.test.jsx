import React from 'react';
import { render, cleanup } from '@testing-library/react';
import selectEvent from 'react-select-event';
import SelectField from './SelectField';
afterEach(cleanup);

describe('SelectField', () => {
	it('Can generate options', () => {
		const options = [
			{
				icon: 'icon',
				label: '0x123',
			},
		];

		const { queryAllByText } = render(<SelectField options={options} field={{ name: 'validator' }} />);
		expect(queryAllByText('icon 0x123')[0].textContent).toBe('icon 0x123');
	});

	it('Can handle null value', () => {
		const { queryAllByText } = render(<SelectField field={{ name: 'validator' }} />);
		expect(queryAllByText('Validator')[0].textContent).toBe('Validator');
	});

	it('Can trigger on change event', async () => {
		const form = {};
		const options = [
			{
				icon: 'icon',
				label: '0x123',
				value: '0x123',
			},
			{
				icon: 'icon 2',
				label: '0x124',
				value: '0x124',
			},
		];
		form.setFieldValue = () => {};

		const spy = jest.spyOn(form, 'setFieldValue');

		const { getByLabelText } = render(
			<form role="form">
				<label htmlFor="validator">ValidatorVal</label>
				<SelectField
					field={{ name: 'validator' }}
					form={form}
					options={options}
					customOptLabel={(e) => e.label}
				/>
			</form>,
		);
		await selectEvent.select(getByLabelText('ValidatorVal'), '0x123');
		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
	});
});
