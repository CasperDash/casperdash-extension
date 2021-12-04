import React from 'react';
import Select from 'react-select';
import CustomOptLabel from './OptLabel';
/**
 * Wrap releact-select to work with Formik.
 *
 * @param {Object}
 * @returns
 */
const SelectField = ({ options, field, form, customOptLabel = CustomOptLabel }) => (
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
