import React from 'react';
import { Button } from 'react-bootstrap';
import CasperDashLogo from '@cd/assets/image/Logo-only.svg';
import { cancelConnectingSite } from '@cd/components/hooks/useServiceWorker';
import './warning.scss';

const WarningLedger = () => {
	const onCancel = () => {
		cancelConnectingSite();
	};

	return (
		<div className="cd_we_dapp_connect_warning">
			<div>
				<h1>Connect With CasperDash</h1>
			</div>
			<div className="cd_we_connect_account_logo">
				<CasperDashLogo />
				<div>CasperDash</div>
			</div>
			<div className="cd_we_connect_account_warning_message">
				Sorry, our wallet currently does not support connecting to dApps using a Ledger device
			</div>
			<div className="cd_we_connect_account_buttons">
				<Button variant="primary" onClick={onCancel}>
					Close
				</Button>
			</div>
		</div>
	);
};

export default WarningLedger;
