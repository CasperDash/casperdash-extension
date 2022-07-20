import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { StorageManager as Storage } from "casper-storage";
import CasperDashLogo from '@cd/assets/image/Logo-only.svg';
import HardwareIcon from '@cd/assets/image/hardware-icon.svg';
import AddIcon from '@cd/assets/image/add-icon.svg';
import { newTab, isPopupMode } from '@cd/helpers/extension/tab';
import { onGetUserHashingOptions, onGetUserInfo} from "@cd/web-extension/CreateWallet/wallet/storage";
import './index.scss';

const ConnectAccount = () => {
	const navigate = useNavigate();

	const handleConnectLedger = () => {
		isPopupMode() ? newTab({ route: '/connectDevice' }) : navigate('/connectDevice');
	};

  const handleManageWallet = () => {
    navigate('/createWallet', { state: { name: 'Recovery Phrase' }});
  }

  useEffect(() => {
    const reload = async () => {
      if (Storage) {
        const cachedUserHash = JSON.parse(await onGetUserHashingOptions());
        const cachedUserInfo = await onGetUserInfo();
        if (cachedUserHash && cachedUserInfo) {
          navigate("/welcomeBack", { state: { name: 'Welcome Back' }});
        }
      }
    };

    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

export default ConnectAccount;
