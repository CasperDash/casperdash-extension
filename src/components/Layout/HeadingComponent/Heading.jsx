import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getPublicKey } from '../../../selectors/user';
import { isConnectedCasper, getSignerStatus } from '../../../selectors/signer';
import {
	connectCasper,
	updateConnectStatus,
	handleUnlockSigner,
	handleLockSigner,
} from '../../../actions/signerActions';
import { updatePublicKeyFromSigner } from '../../../actions/userActions';

const SIGNER_EVENTS = {
	connected: 'signer:connected',
	disconnected: 'signer:disconnected',
	tabUpdated: 'signer:tabUpdated',
	activeKeyChanged: 'signer:activeKeyChanged',
	locked: 'signer:locked',
	unlocked: 'signer:unlocked',
};

const HeadingModule = (props) => {
	const publicKey = useSelector(getPublicKey);
	const { isUnlocked, isConnected } = useSelector(getSignerStatus);
	const dispatch = useDispatch();

	useEffect(() => {
		window.addEventListener(SIGNER_EVENTS.unlocked, (event) => {
			dispatch(handleUnlockSigner(event.detail));
		});
		[SIGNER_EVENTS.locked, SIGNER_EVENTS.disconnected].forEach((event) =>
			window.addEventListener(event, (e) => {
				dispatch(handleLockSigner());
			}),
		);
	});

	useEffect(() => {
		isConnectedCasper().then((isConnected) => {
			dispatch(updateConnectStatus(isConnected));
			if (isConnected) {
				dispatch(updatePublicKeyFromSigner());
			}
		});
	}, [isConnected, dispatch]);

	return (
		<>
			<div className="zl_all_page_heading_section">
				<div className="zl_all_page_heading">
					<h2>{props.name}</h2>
				</div>

				<div className="zl_all_page_notify_logout_btn">
					{!isConnected ? (
						<Button onClick={connectCasper}>{`Connect Casper`}</Button>
					) : !isUnlocked ? (
						<Button onClick={connectCasper}>{`Unlock Casper`}</Button>
					) : (
						<span className="zl_public_key">
							<p title={publicKey}>{publicKey}</p>
						</span>
					)}
				</div>
			</div>
		</>
	);
};

export default HeadingModule;
