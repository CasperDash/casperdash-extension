import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export const AddPublicKeyModal = ({ show, handleClose, handleAddPublicKey, error }) => {
	const [publicKey, setPublicKey] = useState('');

	const handleInputChange = (e) => {
		setPublicKey(e.target.value);
	};

	const onAddNewPublicKey = () => {
		if (typeof handleAddPublicKey === 'function') {
			handleAddPublicKey(publicKey);
		}
	};

	const onCloseModal = () => {
		setPublicKey('');
		handleClose();
	};

	return (
		<Modal show={show} onHide={onCloseModal} centered className="cd_add_token_modal_content" size={'lg'}>
			<Modal.Header closeButton className="cd_add_token_modal_header">
				<Modal.Title>Public Key</Modal.Title>
			</Modal.Header>

			<Modal.Body className="cd_add_token_modal_body">
				<div className="cd_add_token_modal_row">
					<div className="cd_add_token_modal_label">Public Key</div>
					<div className="cd_add_token_modal_value">
						<input
							name="publicKey"
							type="text"
							value={publicKey}
							onChange={(e) => handleInputChange(e)}
							placeholder="Public key"
						/>
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer className="cd_add_token_modal_footer">
				<div className="cd_add_token_modal_error">
					<span>{error}</span>
				</div>
				<Button variant="primary" onClick={onAddNewPublicKey}>
					View
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
