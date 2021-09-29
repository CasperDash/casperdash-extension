import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { KEYS_MANAGER_ATTRS } from '../../constants/keysManager';

export const EditModal = ({
	field,
	value,
	show,
	handleClose,
	handleEditValue,
	handleSummitChange,
	deployError,
	deployHash,
}) => {
	const handleInputChange = (e) => {
		if (typeof handleEditValue === 'function') {
			handleEditValue(e.target.value);
		}
	};
	const attr = KEYS_MANAGER_ATTRS[field] || {};
	return (
		<Modal
			show={show}
			onHide={handleClose}
			centered
			className="cd_edit_modal_content"
			size={deployHash ? 'lg' : ''}
		>
			<Modal.Header closeButton className="cd_edit_modal_header">
				<Modal.Title>Edit {attr.label}</Modal.Title>
			</Modal.Header>

			<Modal.Body className="cd_edit_modal_body">
				<div className="cd_edit_modal_row">
					{!deployHash ? (
						<>
							<div className="cd_edit_modal_label">{attr.label}</div>
							<div className="cd_edit_modal_value">
								<input
									className={attr.className}
									type={attr.type || 'number'}
									value={value}
									onChange={(e) => handleInputChange(e)}
									disabled={deployHash}
								></input>
							</div>
						</>
					) : (
						<>
							<div className="cd_edit_modal_label">Deploy Hash</div>
							<div className="cd_edit_modal_value_success">{deployHash}</div>
						</>
					)}
				</div>
			</Modal.Body>

			<Modal.Footer className="cd_edit_modal_footer">
				<div className="cd_edit_modal_error">
					<span>{deployError}</span>
				</div>
				{!deployHash ? (
					<Button variant="primary" onClick={handleSummitChange}>
						Save
					</Button>
				) : (
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				)}
			</Modal.Footer>
		</Modal>
	);
};
