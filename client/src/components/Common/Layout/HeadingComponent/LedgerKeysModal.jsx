import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { setPublicKey } from '../../../../actions/userActions';
import { getLoginOptions } from '../../../../selectors/user';

export const LedgerKeysModal = ({ show, handleClose, keys }) => {
	// State
	const [selectedKey, setSelectedKey] = useState(null);

	// Hook
	const dispatch = useDispatch();

	// Selector
	const loginOptions = useSelector(getLoginOptions);

	const onCloseModal = () => {
		handleClose();
	};

	// Function
	const changeLedgerKey = () => {
		dispatch(setPublicKey(selectedKey.label, { ...loginOptions, keyPath: selectedKey.value }));
		handleClose();
	};

	const options = keys
		? keys.map((obj) => {
				return {
					label: obj.publicKey,
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
				<Button variant="primary" onClick={changeLedgerKey}>
					Change
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
