import React from 'react';
import Select from 'react-select';
import selectEvent from 'react-select-event';

const OptLabel = (e) => (
	<div>
		<div>
			{e.icon} {e.label}
		</div>
		<div>
			<small>Rate: {e.rate}%</small>
		</div>
	</div>
);

/**
 * Wrap releact-select to work with Formik.
 *
 * @param {Object}
 * @returns
 */
const SelectField = ({ options, field, form, customOptLabel = OptLabel }) => (
	<Select
		options={options}
		inputId={field.name}
		name={field.name}
		value={options ? options.find((option) => option.value === field.value) : null}
		onChange={(option) => form.setFieldValue(field.name, option.value)}
		onBlur={field.onBlur}
		placeholder="Validator"
		getOptionLabel={customOptLabel}
	/>
);

export default SelectField;
