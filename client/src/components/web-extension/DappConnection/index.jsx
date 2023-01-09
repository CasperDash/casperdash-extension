import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import CasperDashLogo from '@cd/assets/image/Logo-only.svg';
import { getPublicKey } from '@cd/selectors/user';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import { addConnectedSite, cancelConnectingSite, getCurrentConnectedUrl } from '@cd/components/hooks/useServiceWorker';
import { withDappConnectorRequired } from '@cd/components/hocs/DappConnectorRequired';
import './index.scss';
import { useState } from 'react';
import { useEffect } from 'react';

const DappConnection = () => {
	const [connectedUrl, setConnectedUrl] = useState('');
	const publicKey = useSelector(getPublicKey);

	useEffect(() => {
		const loadConnectedUrl = async () => {
			const connectedUrl = await getCurrentConnectedUrl();
			setConnectedUrl(connectedUrl);
		}

		loadConnectedUrl();
	}, []);

	const onOk = async () => {
		try {
			await addConnectedSite(connectedUrl, publicKey);
		} catch(err) {
			// eslint-disable-next-line no-console
			console.log(err);
		}
	}

	const onCancel = () => {
		cancelConnectingSite();
	}

	return (
		<div className="cd_we_connect_account">
			<div>
				<h1>Connect With CasperDash</h1>
				<p className="cd_we_connect_account_site">{connectedUrl}</p>
			</div>
			<div className="cd_we_connect_account_logo">
				<CasperDashLogo />
				<div>Casper Dash</div>
			</div>
			<div className="cd_we_connect_account_buttons">
				<Button variant="primary" onClick={onOk}>
					Yes
				</Button>

				<Button variant="secondary" onClick={onCancel}>
					No
				</Button>
			</div>
		</div>
	);
};

export default withDappConnectorRequired(
	withServiceWorkerRequired(DappConnection)
);
