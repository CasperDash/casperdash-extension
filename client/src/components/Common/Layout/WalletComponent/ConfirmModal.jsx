import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const ConfirmModal = ({ show, onClose, fromAddress, toAddress, amount, fee, prize, onConfirm }) => {
	return (
		<Modal show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">Confirm transaction</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<h4>Sender</h4>
				<p>{fromAddress}</p>
				<h4>Recipient</h4>
				<p>{toAddress}</p>
				<h4>Amount</h4>
				<p>{amount}</p>
				<h4>Transaction Fee</h4>
				<p>{fee}</p>
				<h4>Total</h4>
				<p>{amount + fee}</p>
				<p>${(amount + fee) * prize}</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onConfirm}>Confirm</Button>
			</Modal.Footer>
		</Modal>
	);
};
