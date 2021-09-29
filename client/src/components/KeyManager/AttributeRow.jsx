import React from 'react';
import { useSelector } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getPendingDeploys } from '../../selectors/keyManager';

export const AttributeRow = ({ label, value, valueKey, canEdit, onEdit, onShowDeployHash }) => {
	const pendingDeploys = useSelector(getPendingDeploys);
	const editAble = value && canEdit && !(pendingDeploys[valueKey] && pendingDeploys[valueKey].length);
	return (
		<tr>
			<td>{label}</td>
			<td>
				{value}
				{'   '}
				{editAble && (
					<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
						<i
							className="bi bi-pencil-fill cd_account_info_table_action"
							onClick={() => onEdit(valueKey, value)}
						></i>
					</OverlayTrigger>
				)}
				{pendingDeploys[valueKey] && pendingDeploys[valueKey].length
					? pendingDeploys[valueKey].map((deploy) => (
							<OverlayTrigger placement="top" overlay={<Tooltip>{deploy.hash}</Tooltip>}>
								<i
									onClick={() => onShowDeployHash(deploy.hash)}
									class="bi bi-arrow-clockwise cd_account_info_table_action"
								></i>
							</OverlayTrigger>
					  ))
					: null}
			</td>
		</tr>
	);
};
