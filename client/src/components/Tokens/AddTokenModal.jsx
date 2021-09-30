import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export const AddTokenModal = ({ show, handleClose, handleAddToken, error }) => {
	const [addTokenAddress, setAddTokenAddress] = useState('');

	const handleInputChange = (e) => {
		setAddTokenAddress(e.target.value);
	};

	const onAddNewToken = () => {
		if (typeof handleAddToken === 'function') {
			handleAddToken(addTokenAddress);
		}
	};

	const onCloseModal = () => {
		setAddTokenAddress('');
		handleClose();
	};

	return (
		<Modal show={show} onHide={onCloseModal} centered className="cd_add_token_modal_content" size={'lg'}>
			<Modal.Header closeButton className="cd_add_token_modal_header">
				<Modal.Title>Add Token</Modal.Title>
			</Modal.Header>

			<Modal.Body className="cd_add_token_modal_body">
				<div className="cd_add_token_modal_row">
					<div className="cd_add_token_modal_label">Token Address</div>
					<div className="cd_add_token_modal_value">
						<input type="text" value={addTokenAddress} onChange={(e) => handleInputChange(e)}></input>
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer className="cd_add_token_modal_footer">
				<div className="cd_add_token_modal_error">
					<span>{error}</span>
				</div>
				<Button variant="primary" onClick={onAddNewToken}>
					Add
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
