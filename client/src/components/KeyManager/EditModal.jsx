import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { KEYS_MANAGER_ATTRS } from '../../constants/keysManager';

export const EditModal = ({ field, value, show, handleClose, handleEditValue, handleSummitChange }) => {
	const handleInputChange = (e) => {
		if (typeof handleEditValue === 'function') {
			handleEditValue(e.target.value);
		}
	};
	const attr = KEYS_MANAGER_ATTRS[field] || {};
	return (
		<Modal show={show} onHide={handleClose} centered className="zl_edit_modal_content">
			<Modal.Header closeButton className="zl_edit_modal_header">
				<Modal.Title>Edit {attr.label}</Modal.Title>
			</Modal.Header>

			<Modal.Body className="zl_edit_modal_body">
				<div className="zl_edit_modal_row">
					<div className="zl_edit_modal_label">{attr.label}</div>
					<div className="zl_edit_modal_value">
						<input type="number" value={value} onChange={(e) => handleInputChange(e)}></input>
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" onClick={handleSummitChange}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
