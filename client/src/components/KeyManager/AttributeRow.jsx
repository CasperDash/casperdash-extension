import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const AttributeRow = ({ label, value, valueKey, canEdit, onEdit }) => {
	return (
		<tr>
			<td>{label}</td>
			<td>
				{value}
				{'   '}
				{value && canEdit && (
					<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
						<i
							className="bi bi-pencil-fill zl_account_info_table_action"
							onClick={() => onEdit(valueKey, value)}
						></i>
					</OverlayTrigger>
				)}
			</td>
		</tr>
	);
};
