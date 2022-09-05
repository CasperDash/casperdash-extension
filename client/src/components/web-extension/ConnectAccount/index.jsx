import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CasperDashLogo from '@cd/assets/image/Logo-only.svg';
import HardwareIcon from '@cd/assets/image/hardware-icon.svg';
import AddIcon from '@cd/assets/image/add-icon.svg';
import ImportIcon from '@cd/assets/image/import-icon.svg';
import { newTab, isPopupMode } from '@cd/helpers/extension/tab';
import './index.scss';

const ConnectAccount = () => {
	const navigate = useNavigate();

	const handleConnectLedger = useCallback(() => {
		isPopupMode() ? newTab({ route: '/connectDevice' }) : navigate('/connectDevice');
	}, [navigate]);

	const handleManageWallet = useCallback(() => {
		navigate('/createWallet', { state: { name: 'Recovery Phrase' } });
	}, [navigate]);

	const handleImportWallet = useCallback(() => {
		navigate('/importWallet', { state: { name: 'Import Phrase' } });
	}, [navigate]);

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

			<Button variant="normal" onClick={handleImportWallet}>
				<ImportIcon />
				Import Phrase
			</Button>

			<Button variant="normal" onClick={handleConnectLedger}>
				<HardwareIcon />
				Connect Ledger
			</Button>
		</div>
	);
};

export default ConnectAccount;
