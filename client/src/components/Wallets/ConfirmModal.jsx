import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const ConfirmModal = ({
	show,
	onClose,
	fromAddress,
	toAddress,
	amount,
	fee,
	prize,
	onConfirm,
	deployHash,
	deployError,
	isDeploying,
}) => {
	return (
		<Modal
			show={show}
			size="lg"
			className="zl_confirm_modal_content"
			aria-labelledby="contained-modal-title-vcenter"
			centered
			onHide={onClose}
		>
			<Modal.Header closeButton className="zl_confirm_modal_header">
				<Modal.Title id="contained-modal-title-vcenter">Confirm transaction</Modal.Title>
			</Modal.Header>
			<Modal.Body className="zl_confirm_modal_body">
				<div className="zl_confirm_modal_row">
					<span className="zl_confirm_modal_label">Sender</span>
					<span className="zl_confirm_modal_value">{fromAddress}</span>
				</div>

				<div className="zl_confirm_modal_row">
					<span className="zl_confirm_modal_label">Recipient</span>
					<span className="zl_confirm_modal_value">{toAddress}</span>
				</div>

				<div className="zl_confirm_modal_row">
					<span className="zl_confirm_modal_label">Amount</span>
					<span className="zl_confirm_modal_value">{amount}</span>
				</div>

				<div className="zl_confirm_modal_row">
					<span className="zl_confirm_modal_label">Fee</span>
					<span className="zl_confirm_modal_value">{fee}</span>
				</div>
				<hr />
				<div className="zl_confirm_modal_row">
					<span className="zl_confirm_modal_label">Total</span>
					<span className="zl_confirm_modal_value">{amount + fee}</span>
				</div>
				<div className="zl_confirm_modal_row_single">
					<span className="zl_confirm_modal_value">${parseFloat((amount + fee) * prize).toFixed(2)}</span>
				</div>
				{deployHash && (
					<div className="zl_confirm_modal_row">
						<span className="zl_confirm_modal_label">Transaction Hash</span>
						<span className="zl_confirm_modal_value_success">{deployHash}</span>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer className="zl_confirm_modal_footer">
				<span className="zl_confirm_modal_error">{deployError}</span>
				{deployHash ? (
					<Button className="zl_btn_primary_active" onClick={onClose}>
						Close
					</Button>
				) : (
					<Button className="zl_btn_primary_active" onClick={onConfirm} disabled={isDeploying}>
						{isDeploying ? 'Confirming...' : 'Confirm'}
					</Button>
				)}
			</Modal.Footer>
		</Modal>
	);
};
