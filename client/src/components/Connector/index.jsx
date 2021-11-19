import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSelectedWallet, getPublicKey } from '../../selectors/user';
import { Connect } from './Connect';

export const Connector = ({ opener = window.opener }) => {
	const history = useHistory();
	const publicKey = useSelector(getPublicKey);
	const selectedWallet = useSelector(getSelectedWallet);

	const [connectedWallet, setConnectedWallet] = useState(null);

	//get the origin info
	const origin = useMemo(() => {
		const params = new URLSearchParams(window.location.hash.slice(1));
		return params.get('origin');
	}, []);

	const postMessage = useCallback(
		(message) => {
			opener.postMessage({ jsonrpc: '2.0', ...message }, origin);
		},
		[opener, origin],
	);

	useEffect(() => {
		if (!window.opener) {
			history.push('/dashboard');
		}
	});

	//handle disconnect wallet when close popup window
	useEffect(() => {
		if (connectedWallet) {
			const unloadHandler = () => {
				postMessage({ method: 'disconnect' });
			};
			window.addEventListener('beforeunload', unloadHandler);
			return () => {
				unloadHandler();
				window.removeEventListener('beforeunload', unloadHandler);
			};
		}
	}, [connectedWallet, postMessage]);

	// connect wallet
	const onConnect = () => {
		postMessage({ method: 'connected', params: { publicKey } });
		setConnectedWallet(selectedWallet);
	};

	const onDeny = () => {
		window.close();
	};

	return (
		<div className="cd_wallet_connector">
			<div className="cd_wrapper_logo">
				<img src="assets/image/casper-dash-beta-red-black.png" alt="round-shap" className="logo" />
			</div>
			<div className="cd_wallet_connector_content">
				{!connectedWallet && <Connect origin={origin} onConnect={onConnect} onDeny={onDeny} />}
				{connectedWallet && <div>Please keep this window open in background.</div>}
			</div>
		</div>
	);
};

export default Connector;
