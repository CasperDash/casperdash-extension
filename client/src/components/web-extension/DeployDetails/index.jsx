import _get from 'lodash-es/get';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { getValueByFormat } from '../../../helpers/format';
import Copy from '../../Common/Button/Copy';
import ViewInExplorer from '../../Common/Button/ViewInExplorer';
import './DeployDetails.scss';

const DETAILS_MAPPING = [
	{ label: 'Sending address', value: 'fromAddress', copy: true },
	{ label: 'Receiving address', value: 'toAddress', copy: true },
	{ label: 'Amount', value: 'amount', format: 'number' },
	{ label: 'Network Fee', value: 'fee', format: 'number' },
	{ label: 'Transaction Time', value: 'timestamp', format: 'date' },
	{ label: 'Transaction Hash', value: 'deployHash', copy: true },
	{ label: 'Transfer ID', value: 'transferId' },
];

const DeployDetails = () => {
	// Hook
	const {
		state: { deploy },
	} = useLocation();

	return (
		<section className="cd_we_deploy_details cd_we_single_section">
			{DETAILS_MAPPING.map(({ label, value, format, copy }, i) => {
				const deployValue = _get(deploy, value, '');
				const formattedValue = format ? getValueByFormat(deployValue, { format }) : deployValue;
				return (
					<div key={i} className="cd_we_deploy_details_item">
						<div className="cd_we_item_label">{label}</div>
						<div className={'cd_we_item_value'}>
							{formattedValue}
							{copy && <Copy value={deployValue} />}
						</div>
					</div>
				);
			})}
			<div className="cd_we_deploy_details_bottom">
				<div className={`cd_we_item_value  ${deploy.status}`}>{deploy.status}</div>
				<div className="cd_we_view_in_explorer">
					<ViewInExplorer value={deploy.deployHash} type="deploy" text="View in explorer" />
				</div>
			</div>
		</section>
	);
};

export default DeployDetails;
