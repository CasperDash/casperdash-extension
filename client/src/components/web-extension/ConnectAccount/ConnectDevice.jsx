import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useLedger from '../../hooks/useLedger';
import casperDashLogo from '../../../assets/image/Logo-only.svg';
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
				<img src={casperDashLogo} alt="logo" />
				<div>Casper Dash</div>
			</div>
			<h1>Connect a hardware wallet</h1>
			<Button variant="normal" onClick={() => handleConnectLedger(connectCallback)}>
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M22.7493 25.5526L29.18 16.5826C29.43 16.2346 29.43 15.7653 29.18 15.4173L22.7493 6.44729C22.428 5.99862 21.8027 5.89593 21.354 6.21727C20.9053 6.5386 20.802 7.16394 21.124 7.61261L27.1367 15.9999L21.124 24.3873C20.802 24.8359 20.9053 25.4613 21.354 25.7826C21.8027 26.1039 22.428 26.0013 22.7493 25.5526ZM16.9107 25.5526L23.3413 16.5826C23.5906 16.2346 23.5906 15.7653 23.3413 15.4173L16.9107 6.44729C16.5887 5.99862 15.964 5.89593 15.5153 6.21727C15.0667 6.5386 14.9633 7.16394 15.2853 7.61261L21.298 15.9999L15.2853 24.3873C14.9633 24.8359 15.0667 25.4613 15.5153 25.7826C15.964 26.1039 16.5887 26.0013 16.9107 25.5526ZM11.072 6.44729C10.8853 6.18729 10.586 6.03193 10.266 6.02993C9.946 6.02793 9.64466 6.1786 9.45466 6.43593L2.82866 15.4059C2.568 15.7593 2.568 16.2406 2.82866 16.5939L9.45466 25.5639C9.64466 25.8213 9.946 25.972 10.266 25.97C10.586 25.968 10.8853 25.8126 11.072 25.5526L17.5027 16.5826C17.752 16.2346 17.752 15.7653 17.5027 15.4173L11.072 6.44729Z"
						fill="#353945"
					/>
				</svg>
				Connect Ledger
			</Button>
		</div>
	);
};

export default ConnectDevice;
