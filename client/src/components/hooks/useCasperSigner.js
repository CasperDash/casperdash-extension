import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updateConnectStatus, handleUnlockSigner, handleLockSigner } from '../../actions/signerActions';
import { isConnectedCasper, getSignerStatus } from '../../selectors/signer';
import { getPublicKey } from '../../selectors/user';
import { updatePublicKeyFromSigner } from '../../actions/userActions';
import { connectCasperSigner } from '../../services/casperServices';

const SIGNER_EVENTS = {
	connected: 'signer:connected',
	disconnected: 'signer:disconnected',
	initialState: 'signer:initialState',
	tabUpdated: 'signer:tabUpdated',
	activeKeyChanged: 'signer:activeKeyChanged',
	locked: 'signer:locked',
	unlocked: 'signer:unlocked',
};

const useCasperSigner = () => {
	//Hook
	const dispatch = useDispatch();

	//Selector
	const publicKey = useSelector(getPublicKey);
	const { isUnlocked, isConnected, isAvailable } = useSelector(getSignerStatus);

	//State
	const [errorMessage, setErrorMessage] = useState();
	const [isSignerInjected, setIsSignerInjected] = useState();

	//Function
	const dispatchUnlockSinger = useCallback(
		(event) => {
			dispatch(handleUnlockSigner(event.detail));
		},
		[dispatch],
	);

	const dispatchDisconnectedSinger = useCallback(() => {
		dispatch(handleLockSigner());
	}, [dispatch]);

	const handleConnectCasper = () => {
		const connectMessage = connectCasperSigner();
		if (connectMessage) {
			setErrorMessage(connectMessage);
			toast.error(connectMessage);
		}
	};

	const handleSignerInjected = () => {
		setIsSignerInjected(true);
	};

	//Effect
	useEffect(() => {
		[SIGNER_EVENTS.unlocked, SIGNER_EVENTS.activeKeyChanged, SIGNER_EVENTS.connected].forEach((event) =>
			window.addEventListener(event, dispatchUnlockSinger),
		);
		[SIGNER_EVENTS.locked, SIGNER_EVENTS.disconnected].forEach((event) =>
			window.addEventListener(event, dispatchDisconnectedSinger),
		);
		[SIGNER_EVENTS.initialState].forEach((event) => window.addEventListener(event, handleSignerInjected));

		return () => {
			[SIGNER_EVENTS.unlocked, SIGNER_EVENTS.activeKeyChanged, SIGNER_EVENTS.connected].forEach((event) =>
				window.removeEventListener(event, dispatchUnlockSinger),
			);
			[SIGNER_EVENTS.locked, SIGNER_EVENTS.disconnected].forEach((event) =>
				window.removeEventListener(event, dispatchDisconnectedSinger),
			);
			[SIGNER_EVENTS.initialState].forEach((event) => window.removeEventListener(event, handleSignerInjected));
		};
	});

	useEffect(() => {
		(async function () {
			if (!publicKey) {
				const isConnected = await isConnectedCasper();
				dispatch(updateConnectStatus(isConnected));
				if (isConnected) {
					dispatch(updatePublicKeyFromSigner());
				}
			}
		})();
	}, [isConnected, dispatch, publicKey, isSignerInjected]);

	const ConnectSignerButton = () => {
		return (
			<>
				{!publicKey && (
					<Button className="cd_all_page_logout_btn" onClick={handleConnectCasper}>
						{!isConnected ? `Connect Casper` : `Unlock Signer`}
					</Button>
				)}
			</>
		);
	};

	return { ConnectSignerButton, connectionError: errorMessage, isAvailable, handleConnectCasper };
};

export default useCasperSigner;
