import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const EditModal = ({ field, value, show, handleClose, handleEditValue, handleSummitChange }) => {
	const handleInputChange = (e) => {
		if (typeof handleEditValue === 'function') {
			handleEditValue(e.target.value);
		}
	};
	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton>
				<Modal.Title>Edit {field}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<div>{field}</div>
				<div>
					<input value={value} onChange={(e) => handleInputChange(e)}></input>
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
