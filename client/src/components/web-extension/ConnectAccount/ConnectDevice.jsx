import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CasperDashLogo from 'assets/image/Logo-only.svg';
import HardwareIcon from 'assets/image/hardware-icon.svg';
import useLedger from '../../hooks/useLedger';
import './ConnectDevice.scss';

const ConnectDevice = () => {
	const navigate = useNavigate();

	const connectCallback = () => {
		navigate('/');
	};

	const { handleConnectLedger } = useLedger();

	return (
		<div className="cd_we_connect_device">
			<div className="cd_we_connect_account_logo">
				<CasperDashLogo />
				<div>Casper Dash</div>
			</div>
			<h1>Connect a hardware wallet</h1>
			<Button variant="normal" onClick={() => handleConnectLedger(connectCallback)}>
				<HardwareIcon />
				Connect Ledger
			</Button>
		</div>
	);
};

export default ConnectDevice;
