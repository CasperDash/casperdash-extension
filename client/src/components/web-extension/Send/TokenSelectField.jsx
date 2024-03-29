import React from 'react';
import Select from 'react-select';
import isEmpty from 'lodash-es/isEmpty';
import { TokenField } from './TokenField';
/**
 * Wrap react-select to work with Formik.
 *
 * @param {Object}
 * @returns
 */
const TokenSelectField = ({ options, field, form, handleTokenChange }) => {
	return (
		<Select
			className="cd_we_dropdown"
			options={options}
			inputId={field.name}
			name={field.name}
			value={
				!isEmpty(options) && Array.isArray(options)
					? options.find((option) => option.address === field.value)
					: null
			}
			onChange={(option) => {
				form.setFieldValue(field.name, option.address);
				handleTokenChange(option.address);
			}}
			onBlur={field.onBlur}
			placeholder="Token"
			getOptionLabel={TokenField}
		/>
	);
};

export default TokenSelectField;
