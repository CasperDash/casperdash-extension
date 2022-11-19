import React from 'react';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import PasswordForm from '@cd/components/web-extension/Common/AuthLogin/PasswordForm';
import './LoginModal.scss';

const EnterPasswordModal = ({
	isOpen,
	onSubmitPassword,
	title = '',
	onCloseModal,
	closeButton = true,
	description = 'Please login again to continue using the Wallet.',
}) => {
	return (
		<Modal
			backdropClassName="cd_we_login-modal--backdrop"
			onHide={onCloseModal}
			show={isOpen}
			className="cd_we_login-modal"
			centered
		>
			<Modal.Header closeButton={closeButton}>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="cd_we_create-wallet-layout--root">
					<div className="layout--body">
						<PasswordForm onSubmitPassword={onSubmitPassword} passwordLabel={description} />
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
};

EnterPasswordModal.propTypes = {
	onSubmitPassword: PropTypes.func,
	onCloseModal: PropTypes.func,
	isOpen: PropTypes.bool,
	title: PropTypes.string,
	closeButton: PropTypes.bool,
};

export default EnterPasswordModal;
