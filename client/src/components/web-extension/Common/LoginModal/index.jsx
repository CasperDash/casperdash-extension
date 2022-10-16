import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { getLoginModalOpen } from '@cd/selectors/loginModal';
import { setLoginModalOpen } from '@cd/actions/loginModalAction';
import AuthLogin from '@cd/components/web-extension/Common/AuthLogin';
import './LoginModal.scss';

export const LoginModal = () => {
	const isOpen = useSelector(getLoginModalOpen);
	const dispatch = useDispatch();

	const handleOnLoginSuccess = () => {
		dispatch(setLoginModalOpen(false));
	};

	return (
		<Modal backdropClassName="cd_we_login-modal--backdrop" show={isOpen} className="cd_we_login-modal" centered>
			<Modal.Header closeButton={false}>
				<Modal.Title>Your session has expired</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="cd_we_create-wallet-layout--root">
					<div className="cd_we_create-wallet-layout--body">
						<AuthLogin
							onLoginSuccess={handleOnLoginSuccess}
							passwordLabel="Please login again to continue using Casper Wallet."
						/>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};
