import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CasperDashLogo from 'assets/image/Logo-only.svg';
import HardwareIcon from 'assets/image/hardware-icon.svg';
import AddIcon from 'assets/image/add-icon.svg';
import { newTab, isPopupMode } from '../../../helpers/extension/tab';
import './index.scss';

const ConnectAccount = () => {
	const navigate = useNavigate();

	const handleConnectLedger = () => {
		isPopupMode() ? newTab({ route: '/connectDevice' }) : navigate('/connectDevice');
	};

	return (
		<div className="cd_we_connect_account">
			<div className="cd_we_connect_account_logo">
				<CasperDashLogo />
				<div>Casper Dash</div>
			</div>
			<Button variant="normal" onClick={() => navigate('/addPublicKey', { state: { name: 'Add' } })}>
				<AddIcon />
				View Mode
			</Button>
			<Button variant="normal" onClick={() => navigate('/createWallet', { state: { name: 'Recovery Phrase' } })}>
				<AddIcon />
				Create new wallet
			</Button>
			<Button variant="normal" onClick={handleConnectLedger}>
				<HardwareIcon />
				Connect Ledger
			</Button>
		</div>
	);
};

export default ConnectAccount;
