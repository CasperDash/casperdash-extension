import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { setKeyPath } from '../../../../actions/ledgerActions';
import { setPublicKey } from '../../../../actions/userActions';

export const LedgerKeysModal = ({ show, handleClose, keys, error }) => {
	// State
	const [selectedKey, setSelectedKey] = useState(null);

	// Hook
	const dispatch = useDispatch();

	const onCloseModal = () => {
		handleClose();
	};

	// Function
	const changeLedgerKey = () => {
		dispatch(setPublicKey(selectedKey.label));
		dispatch(setKeyPath(selectedKey.value));
		handleClose();
	};

	const options = keys
		? keys.map((obj) => {
				return {
					label: obj.key,
					value: obj.path,
				};
		  })
		: [];

	return (
		<Modal show={show} onHide={onCloseModal} centered className="cd_add_token_modal_content" size={'lg'}>
			<Modal.Header closeButton className="cd_add_token_modal_header">
				<Modal.Title>Derivable Accounts</Modal.Title>
			</Modal.Header>

			<Modal.Body className="cd_add_token_modal_body">
				<div className="cd_add_token_modal_row">
					<div className="cd_add_token_modal_value">
						<Select
							placeholder="Select the account"
							options={options}
							onChange={(option) => setSelectedKey(option)}
						/>
					</div>
				</div>
			</Modal.Body>

			<Modal.Footer className="cd_add_token_modal_footer">
				<div className="cd_add_token_modal_error">
					<span>{error}</span>
				</div>
				<Button variant="primary" onClick={changeLedgerKey}>
					Change
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
