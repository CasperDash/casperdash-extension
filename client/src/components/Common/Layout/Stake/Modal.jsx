import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toFormattedNumber, toFormattedCurrency } from '../../../../helpers/format';

import './Modal.scss';

const ModalRow = ({ label, value, customClass }) => (
	<div className={`cd_confirm_modal_row ${customClass}`}>
		<span className="cd_confirm_modal_label">{label}</span>
		<span className="cd_confirm_modal_value">{value}</span>
	</div>
);

const SingleCurrencyRow = ({ amount }) => (
	<div className="cd_confirm_modal_row_single">
		<span className="cd_confirm_modal_value">{amount}</span>
	</div>
);

const CurrencyModalRow = ({ label, amount, currency = 'CSPR', currentPrice, customClass }) => (
	<>
		<div className={`cd_confirm_modal_row ${customClass}`}>
			<span className="cd_confirm_modal_label">{label}</span>
			<span className="cd_confirm_modal_value">
				{toFormattedNumber(amount)} <b>{currency}</b>
			</span>
		</div>
		<SingleCurrencyRow amount={toFormattedCurrency(amount * currentPrice)} />
	</>
);

export const ConfirmationModal = ({
	title,
	show,
	fromAddress,
	validator,
	amount,
	fee,
	currentPrice,
	deployHash,
	deployError,
	isDeploying,
	onClose,
	onConfirm,
}) => {
	const totalCspr = amount + fee;
	return (
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
				<CurrencyModalRow label="You'll delegate" amount={amount} currentPrice={currentPrice} />
				<hr />
				<CurrencyModalRow label="Transaction fee" amount={fee} currentPrice={currentPrice} />
				<hr />
				<CurrencyModalRow label="Total" amount={totalCspr} currentPrice={currentPrice} customClass="total" />
			</Modal.Body>
			<Modal.Footer className="cd_confirm_modal_footer">
				<span className="cd_confirm_modal_error">{deployError}</span>
				<Button variant="danger" onClick={onClose}>
					Confirm and delegate stake
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ConfirmationModal;
