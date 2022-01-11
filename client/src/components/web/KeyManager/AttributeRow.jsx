import React from 'react';
import { useSelector } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getPendingDeploys } from '../../../selectors/keyManager';

export const AttributeRow = ({ label, value, valueKey, canEdit, onEdit }) => {
	const pendingDeploys = useSelector(getPendingDeploys);
	const editable = value && canEdit && !(pendingDeploys[valueKey] && pendingDeploys[valueKey].length);
	return (
		<tr>
			<td>{label}</td>
			<td>
				{value}
				{'   '}
				{editable && (
					<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
						<i
							className="bi bi-pencil-fill cd_account_info_table_action"
							onClick={() => onEdit(valueKey, value)}
						/>
					</OverlayTrigger>
				)}
				{pendingDeploys[valueKey] && pendingDeploys[valueKey].length
					? pendingDeploys[valueKey].map((deploy) => (
							<OverlayTrigger
								key={deploy.hash}
								placement="top"
								overlay={<Tooltip>{deploy.hash}</Tooltip>}
							>
								<i className="bi bi-arrow-clockwise cd_account_info_table_action" />
							</OverlayTrigger>
					  ))
					: null}
			</td>
		</tr>
	);
};
