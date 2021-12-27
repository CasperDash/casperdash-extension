import _get from 'lodash-es/get';
import React from 'react';
import { useLocation } from 'react-router-dom';
import './DeployDetails.scss';

const DETAILS_MAPPING = [
	{ label: 'Sending address', value: 'fromAddress' },
	{ label: 'Receiving address', value: 'toAddress' },
	{ label: 'Amount', value: 'amount' },
	{ label: 'Network Fee', value: 'fee' },
	{ label: 'Transaction Time', value: 'timestamp' },
	{ label: 'Transaction Hash', value: 'deployHash' },
	{ label: 'Transfer ID', value: 'transferId' },
	{ value: 'status' },
];

const DeployDetails = () => {
	// Hook
	const {
		state: { deploy },
	} = useLocation();

	return (
		<section className="cd_we_deploy_details">
			{DETAILS_MAPPING.map(({ label, value }, i) => {
				const deployValue = _get(deploy, value, '');
				return (
					<div key={i} className="cd_we_deploy_details_item">
						<div className="cd_we_item_label">{label}</div>
						<div className={`cd_we_item_value ${value === 'status' ? deployValue : ''}`}>{deployValue}</div>
					</div>
				);
			})}
			<div>View in explorer</div>
		</section>
	);
};

export default DeployDetails;
