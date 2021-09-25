import React from 'react';
import { useSelector } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getPendingDeploys } from '../../selectors/keyManager';

export const AttributeRow = ({ label, value, valueKey, canEdit, onEdit }) => {
	const pendingDeploys = useSelector(getPendingDeploys);

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
				{pendingDeploys[valueKey] &&
					pendingDeploys[valueKey].length &&
					pendingDeploys[valueKey].map((deploy) => (
						<OverlayTrigger placement="top" overlay={<Tooltip>{deploy.hash}</Tooltip>}>
							<i class="bi bi-arrow-clockwise"></i>
						</OverlayTrigger>
					))}
			</td>
		</tr>
	);
};
