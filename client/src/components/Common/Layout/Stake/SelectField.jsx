import React from 'react';
import Select from 'react-select';

/**
 * Wrap releact-select to work with Formik.
 *
 * @param {Object}
 * @returns
 */
const SelectField = ({ options, field, form }) => (
	<Select
		options={options}
		name={field.name}
		value={options ? options.find((option) => option.value === field.value) : null}
		onChange={(option) => form.setFieldValue(field.name, option.value)}
		onBlur={field.onBlur}
		placeholder="Validator"
		getOptionLabel={(e) => (
			<div>
				<div>
					{e.icon} {e.label}
				</div>
				<div>
					<small>Rate: {e.rate}%</small>
				</div>
			</div>
		)}
	/>
);

export default SelectField;
