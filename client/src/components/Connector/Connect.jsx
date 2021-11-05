import React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedWallet, getPublicKey } from '../../selectors/user';

export const Connect = ({ onConnect, origin, onDeny }) => {
	const publicKey = useSelector(getPublicKey);
	const wallet = useSelector(getSelectedWallet);
	return (
		<>
			<div className="cd_wallet_connector_message">
				<p>Allow this site to access your Casper account ?</p>
				<p> {origin}</p>

				<p>{wallet.name}</p>
				<p className="cd_wallet_connector_key">{publicKey}</p>

				<div>Only connect with sites you trust.</div>
			</div>
			<div className="cd_wallet_connector_button">
				<button className="btn mx-auto" onClick={onDeny}>
					Deny
				</button>
				<button className="btn mx-auto" onClick={onConnect}>
					Connect
				</button>
			</div>
		</>
	);
};
