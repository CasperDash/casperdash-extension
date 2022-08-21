import React from 'react';
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CasperDashLogo from '@cd/assets/image/Logo-only.svg';
import HardwareIcon from '@cd/assets/image/hardware-icon.svg';
import AddIcon from '@cd/assets/image/add-icon.svg';
import { newTab, isPopupMode } from '@cd/helpers/extension/tab';
import './index.scss';

const ConnectAccount = () => {
	const navigate = useNavigate();

	const handleConnectLedger = () => {
		isPopupMode() ? newTab({ route: '/connectDevice' }) : navigate('/connectDevice');
	};

	const handleManageWallet = () => {
		navigate('/createWallet', { state: { name: 'Recovery Phrase' } });
	};

	return (
		<div className="cd_we_connect_account">
			<div className="cd_we_connect_account_logo">
				<CasperDashLogo />
				<div>Casper Dash</div>
			</div>
			<Button variant="normal" onClick={handleManageWallet}>
				<AddIcon />
				Create new wallet
			</Button>
			<Button variant="normal" onClick={() => navigate('/addPublicKey', { state: { name: 'Add' } })}>
				<AddIcon />
				View Mode
			</Button>
			<Button variant="normal" onClick={handleConnectLedger}>
				<HardwareIcon />
				Connect Ledger
			</Button>
		</div>
	);
};
 
export default connect(state => {
	console.log(`🚀 ~ state`, state)
	return state;
})(ConnectAccount);

// export default ConnectAccount;
