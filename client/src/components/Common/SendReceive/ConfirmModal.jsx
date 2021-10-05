import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toFormattedNumber, toFormattedCurrency } from '../../../helpers/format';

export const ConfirmModal = ({
	show,
	onClose,
	fromAddress,
	toAddress,
	amount,
	fee,
	onConfirm,
	deployHash,
	deployError,
	isDeploying,
	currentPrice,
	csprPrice,
	tokenSymbol,
	isTokenTransfer,
}) => {
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
				<Modal.Title id="contained-modal-title-vcenter">Confirm transaction</Modal.Title>
			</Modal.Header>
			<Modal.Body className="cd_confirm_modal_body">
				<div className="cd_confirm_modal_row">
					<span className="cd_confirm_modal_label">Sender</span>
					<span className="cd_confirm_modal_value">{fromAddress}</span>
				</div>

				<div className="cd_confirm_modal_row">
					<span className="cd_confirm_modal_label">Recipient</span>
					<span className="cd_confirm_modal_value">{toAddress}</span>
				</div>

				<div className="cd_confirm_modal_row">
					<span className="cd_confirm_modal_label">Amount</span>
					<span className="cd_confirm_modal_value">
						{toFormattedNumber(amount)} <b>{tokenSymbol}</b>
					</span>
				</div>

				<div className="cd_confirm_modal_row">
					<span className="cd_confirm_modal_label">Fee</span>
					<span className="cd_confirm_modal_value">
						{toFormattedNumber(fee)} <b>CSPR</b>
					</span>
				</div>
				<hr />
				{!isTokenTransfer && (
					<div className="cd_confirm_modal_row">
						<span className="cd_confirm_modal_label">Total</span>
						<span className="cd_confirm_modal_value">
							{toFormattedNumber(amount + fee)} <b>CSPR</b>
						</span>
					</div>
				)}
				{isTokenTransfer && (
					<>
						<div className="cd_confirm_modal_row">
							<span className="cd_confirm_modal_label">Total</span>
							<span className="cd_confirm_modal_value">
								{toFormattedNumber(amount)} <b>{tokenSymbol}</b>
							</span>
						</div>
						<div className="cd_confirm_modal_row_single">
							<span className="cd_confirm_modal_value">
								{fee} <b>CSPR</b>
							</span>
						</div>
					</>
				)}
				{currentPrice && csprPrice && (
					<div className="cd_confirm_modal_row_single">
						<span className="cd_confirm_modal_value">
							{toFormattedCurrency(amount * currentPrice + csprPrice * fee)}
						</span>
					</div>
				)}

				{deployHash && (
					<div className="cd_confirm_modal_row">
						<span className="cd_confirm_modal_label">Transaction Hash</span>
						<span className="cd_confirm_modal_value_success">{deployHash}</span>
					</div>
				)}
			</Modal.Body>
			<Modal.Footer className="cd_confirm_modal_footer">
				<span className="cd_confirm_modal_error">{deployError}</span>
				{deployHash ? (
					<Button className="cd_btn_primary_active" onClick={onClose}>
						Close
					</Button>
				) : (
					<Button className="cd_btn_primary_active" onClick={onConfirm} disabled={isDeploying}>
						{isDeploying ? 'Confirming...' : 'Confirm'}
					</Button>
				)}
			</Modal.Footer>
		</Modal>
	);
};
