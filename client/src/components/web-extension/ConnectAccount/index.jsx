import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import CasperDashLogo from 'assets/image/Logo-only.svg';
import HardwareIcon from 'assets/image/hardware-icon.svg';
import AddIcon from 'assets/image/add-icon.svg';
import { newTab, isPopupMode } from '../../../helpers/extension/tab';
import './index.scss';

const ConnectAccount = () => {
  const createWalletConfigs = {
    0: "Recovery Phrase",
    1: "Doube Check",
    2: "Enter Password"
  }
	const navigate = useNavigate();

	const handleConnectLedger = () => {
		isPopupMode() ? newTab({ route: '/connectDevice' }) : navigate('/connectDevice');
	};

  const handleManageWallet = () => {
    navigate('/createWallet', { state: { name: 'Recovery Phrase', ...createWalletConfigs }});
  }

	return (
		<div className="cd_we_connect_account">
			<div className="cd_we_connect_account_logo">
				<CasperDashLogo />
				<div>Casper Dash</div>
			</div>
      <Button variant="normal" onClick={handleManageWallet}>
				<AddIcon />
				Manage Wallet 
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

export default ConnectAccount;
