import React from 'react';
export const AttributeRow = ({ label, value, valueKey, canEdit, onEdit }) => {
	return (
		<tr>
			<td>{label}</td>
			<td>
				{value}
				{'   '}
				{value && canEdit && (
					<i
						className="bi bi-pencil-fill zl_account_info_table_action"
						onClick={() => onEdit(valueKey, value)}
					></i>
				)}
			</td>
		</tr>
	);
};
