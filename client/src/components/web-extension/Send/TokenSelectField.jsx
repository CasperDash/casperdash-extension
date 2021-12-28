import React from 'react';
import Select from 'react-select';
import { TokenField } from './TokenField';
/**
 * Wrap react-select to work with Formik.
 *
 * @param {Object}
 * @returns
 */
const TokenSelectField = ({ options, field, form }) => (
	<Select
		className="cd_we_dropdown"
		options={options}
		inputId={field.name}
		name={field.name}
		value={options ? options.find((option) => option.address === field.value) : null}
		onChange={(option) => {
			form.setFieldValue(field.name, option.address);
		}}
		onBlur={field.onBlur}
		placeholder="Token"
		getOptionLabel={TokenField}
	/>
);

export default TokenSelectField;
