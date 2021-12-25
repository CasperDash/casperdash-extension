/* eslint-disable react/jsx-indent-props */
import React from 'react';
import { Form, FormControl } from 'react-bootstrap';

export const NFTAttributeRow = ({ values, errors, index, onRemoveAttribute, handleChange }) => {
	const attributeName = `attribute${index}`;
	const attributeValue = `value${index}`;
	return (
		<div className="cd_nft_mint_attributes_input">
			<FormControl
				required
				placeholder="Name"
				name={attributeName}
				value={values[attributeName] || ''}
				onChange={handleChange}
				isInvalid={errors[attributeName]}
			/>
			<Form.Control.Feedback type="invalid">{errors[attributeName]}</Form.Control.Feedback>

			<FormControl
				required
				placeholder="Value"
				name={attributeValue}
				value={values[attributeValue] || ''}
				onChange={handleChange}
				isInvalid={errors[attributeValue]}
			/>
			<Form.Control.Feedback type="invalid">{errors[attributeValue]}</Form.Control.Feedback>
			<i className="bi bi-dash-circle-fill" onClick={() => onRemoveAttribute(index)} />
		</div>
	);
};
