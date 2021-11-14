import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { useAutoRefreshEffect } from '../../../hooks/useAutoRefreshEffect';
import { getPublicKey } from '../../../../selectors/user';
import { isConnectedCasper, getSignerStatus } from '../../../../selectors/signer';
import { updateConnectStatus, handleUnlockSigner, handleLockSigner } from '../../../../actions/signerActions';
import { updatePublicKeyFromSigner, getUserDetails, setPublicKey } from '../../../../actions/userActions';
import { connectCasperSigner } from '../../../../services/casperServices';
import { isValidPublicKey } from '../../../../helpers/validator';
import { AddPublicKeyModal } from './AddPublicKeyModal';

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
	const { isUnlocked, isConnected, isAvailable } = useSelector(getSignerStatus);

	const [showError, setShowError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [showPublicKeyInput, setShowPublicKeyInput] = useState(false);
	const [publicKeyError, setPublicKeyError] = useState('');

	const dispatch = useDispatch();

	const dispatchUnlockSinger = useCallback(
		(event) => {
			dispatch(handleUnlockSigner(event.detail));
		},
		[dispatch],
	);

	const dispatchDisconnectedSinger = useCallback(() => {
		dispatch(handleLockSigner());
	}, [dispatch]);

	useEffect(() => {
		[SIGNER_EVENTS.unlocked, SIGNER_EVENTS.activeKeyChanged, SIGNER_EVENTS.connected].forEach((event) =>
			window.addEventListener(event, dispatchUnlockSinger),
		);
		[SIGNER_EVENTS.locked, SIGNER_EVENTS.disconnected].forEach((event) =>
			window.addEventListener(event, dispatchDisconnectedSinger),
		);

		return () => {
			[SIGNER_EVENTS.unlocked, SIGNER_EVENTS.activeKeyChanged, SIGNER_EVENTS.connected].forEach((event) =>
				window.removeEventListener(event, dispatchUnlockSinger),
			);
			[SIGNER_EVENTS.locked, SIGNER_EVENTS.disconnected].forEach((event) =>
				window.removeEventListener(event, dispatchDisconnectedSinger),
			);
		};
	});

	useEffect(() => {
		isConnectedCasper().then((isConnected) => {
			dispatch(updateConnectStatus(isConnected));
			if (isConnected) {
				dispatch(updatePublicKeyFromSigner());
			}
		});
	}, [isConnected, dispatch]);

	useAutoRefreshEffect(() => {
		if (publicKey) {
			dispatch(getUserDetails(publicKey));
		}
	}, [publicKey, dispatch]);

	const handleCloseError = () => setShowError(false);
	const handleShowError = () => setShowError(true);

	const handleConnectCasper = () => {
		const connectMessage = connectCasperSigner();
		if (connectMessage) {
			handleShowError();
			setErrorMessage(connectMessage);
		}
	};

	const onClickViewMode = () => {
		setShowPublicKeyInput(true);
	};

	const onClosePublicKeyModal = () => {
		setShowPublicKeyInput(false);
	};

	const handleAddPublicKey = (pk) => {
		if (isValidPublicKey(pk)) {
			dispatch(setPublicKey(pk));
			onClosePublicKeyModal();
		} else {
			setPublicKeyError('Invalid public key');
		}
	};

	return (
		<>
			<div className="cd_all_page_heading_section">
				<div className="cd_all_page_heading">
					<h2>{props.name}</h2>
				</div>
				<div className="cd_public_key_view">
					{!publicKey && !isAvailable && (
						<Button className="cd_btn_primary_active" onClick={onClickViewMode}>
							View Mode
						</Button>
					)}
				</div>
				<div className="cd_all_page_notify_logout_btn">
					{!isConnected ? (
						<Button
							className="cd_btn_primary_active"
							onClick={handleConnectCasper}
						>{`Connect Casper`}</Button>
					) : !isUnlocked ? (
						<Button
							className="cd_btn_primary_active"
							onClick={handleConnectCasper}
						>{`Unlock Casper`}</Button>
					) : (
						<span className="cd_public_key">
							<p title={publicKey}>{publicKey}</p>
						</span>
					)}
				</div>
				<Modal
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					show={showError}
					onHide={handleCloseError}
				>
					<Modal.Body>
						<p>{errorMessage}</p>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={handleCloseError}>Close</Button>
					</Modal.Footer>
				</Modal>
				<AddPublicKeyModal
					show={showPublicKeyInput}
					handleClose={onClosePublicKeyModal}
					handleAddPublicKey={handleAddPublicKey}
					error={publicKeyError}
				/>
			</div>
		</>
	);
};

export default HeadingModule;
