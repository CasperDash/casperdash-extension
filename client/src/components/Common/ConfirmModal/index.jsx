import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ConfirmModal.scss';

const ConfirmModal = ({
	title = 'Are your sure?',
	description = '',
	buttonOkText = 'Yes',
	buttonCloseText = 'No',
	isOpen = false,
	onClose,
	onConfirm,
}) => {
	return (
		<Modal show={isOpen} onHide={onClose} className="cd_we_confirm-modal">
			<Modal.Header>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{description}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onClose}>
					{buttonCloseText}
				</Button>
				<Button variant="primary" onClick={onConfirm}>
					{buttonOkText}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

ConfirmModal.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	buttonOkText: PropTypes.string,
	buttonCloseText: PropTypes.string,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onConfirm: PropTypes.func.isRequired,

	header: PropTypes.node,
	isShowReset: PropTypes.bool,
	onLoginSuccess: PropTypes.func,
	passwordLabel: PropTypes.string,
};

export default ConfirmModal;
