import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSelectedWallet, getPublicKey } from '../../selectors/user';

export const Connector = ({ opener }) => {
	const publicKey = useSelector(getPublicKey);
	const wallet = useSelector(getSelectedWallet);

	const [selectedWallet, setSelectedWallet] = useState(selectedWallet);

	useEffect(() => {
		setSelectedWallet(wallet);
	}, [publicKey]);

	const origin = useMemo(() => {
		const params = new URLSearchParams(window.location.hash.slice(1));
		return params.get('origin');
	}, []);

	const postMessage = useCallback(() => {
		(message) => {
			opener.postMessage({ jsonrpc: '2.0', ...message }, origin);
		};
	}, [opener, origin]);

	return <></>;
};
