import React from 'react';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import AuthLogin from '@cd/components/web-extension/Common/AuthLogin';
import './LoginModal.scss';

const LoginModalConfirm = ({ isOpen, onLoginSuccess, title = '' }) => {
	return (
		<Modal backdropClassName="cd_we_login-modal--backdrop" show={isOpen} className="cd_we_login-modal" centered>
			<Modal.Header closeButton={false}>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="cd_we_create-wallet-layout--root">
					<div className="cd_we_create-wallet-layout--body">
						<AuthLogin
							onLoginSuccess={onLoginSuccess}
							passwordLabel="Please login again to continue using the Wallet."
						/>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

LoginModalConfirm.propTypes = {
	onLoginSuccess: PropTypes.func,
	isOpen: PropTypes.bool,
	title: PropTypes.string,
};

export default LoginModalConfirm;
