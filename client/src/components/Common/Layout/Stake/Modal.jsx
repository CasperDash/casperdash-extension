import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalRow from '../Modal/Row';
import CurrencyModalRow from '../Modal/CurrencyModalRow';

export const ConfirmationModal = ({
	title,
	show,
	fromAddress,
	validator,
	amount,
	fee,
	currentPrice,
	isDeploying,
	onClose,
	onConfirm,
	stakeAction = 'delegate',
}) => (
	<Modal
		show={show}
		size="lg"
		className="cd_confirm_modal_content"
		aria-labelledby="contained-modal-title-vcenter"
		centered
		onHide={onClose}
	>
		<Modal.Header closeButton className="cd_confirm_modal_header">
			<Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
		</Modal.Header>
		<Modal.Body className="cd_confirm_modal_body">
			<ModalRow label="Account" value={fromAddress} />
			<ModalRow label="Validator" value={validator} />
			<CurrencyModalRow label={`You'll ${stakeAction}`} amount={amount} currentPrice={currentPrice} />
			<hr />
			<CurrencyModalRow label="Transaction fee" amount={fee} currentPrice={currentPrice} />
			<hr />
			<CurrencyModalRow label="Total" amount={amount + fee} currentPrice={currentPrice} customClass="total" />
		</Modal.Body>
		<Modal.Footer className="cd_confirm_modal_footer">
			<Button className="cd_btn_primary_active" onClick={onConfirm} disabled={isDeploying}>
				{isDeploying ? 'Confirming...' : 'Confirm'}
			</Button>
		</Modal.Footer>
	</Modal>
);

export default ConfirmationModal;
