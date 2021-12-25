import React from 'react';
import Select from 'react-select';
import { ContractField } from './ContractField';
/**
 * Wrap react-select to work with Formik.
 *
 * @param {Object}
 * @returns
 */
const SelectField = ({ options, field, form }) => (
	<Select
		className="cd_nft_mint_contract_dropdown"
		options={options}
		inputId={field.name}
		name={field.name}
		value={options ? options.find((option) => option.value === field.value) : null}
		onChange={(option) => form.setFieldValue(field.name, option.value)}
		onBlur={field.onBlur}
		placeholder="NFT Contract"
		getOptionLabel={ContractField}
	/>
);

export default SelectField;
