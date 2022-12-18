import React from 'react';
import { Button } from 'react-bootstrap';
import CasperDashLogo from '@cd/assets/image/Logo-only.svg';
import { getPublicKey } from '@cd/selectors/user';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import { addConnectedSite, closePopup, getCurrentConnectedUrl } from '@cd/components/hooks/useServiceWorker';
import { useSelector } from 'react-redux';
import './index.scss';

const DappConnection = () => {
	const publicKey = useSelector(getPublicKey);

	const onOk = async () => {
		const connectedUrl = await getCurrentConnectedUrl();

		try {
			await addConnectedSite(connectedUrl, publicKey);
		} catch(err) {
			// eslint-disable-next-line no-console
			console.log(err);
		}
	}

	const onCancel = () => {
		closePopup();
	}

	return (
		<div className="cd_we_connect_account">
			<div>
				<h1>Connect With CasperDash</h1>
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

export default withServiceWorkerRequired(DappConnection);
