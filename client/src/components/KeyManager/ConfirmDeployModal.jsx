import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const DeployConfirmModal = ({ show, handleClose, message, onDeploy }) => {
	return (
		<Modal show={show} onHide={handleClose} centered className="zl_key_manger_contract_confirm_modal">
			<Modal.Header closeButton>
				<Modal.Title>Confirm Deploy</Modal.Title>
			</Modal.Header>

			<Modal.Body>{message}</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" onClick={onDeploy}>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
