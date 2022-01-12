import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { setPublicKey as storePublicKey } from '../../../actions/userActions';
import { isValidPublicKey } from '../../../helpers/validator';
import './AddPublicKey.scss';

export const AddPublicKey = () => {
	//Hook
	const dispatch = useDispatch();
	const navigate = useNavigate();

	//State
	const [publicKey, setPublicKey] = useState('');
	const [error, setError] = useState('');

	//Function
	const onAddPublicKey = () => {
		// fetch token info
		dispatch(storePublicKey(publicKey));
		navigate('/');
	};

	const onChange = (e) => {
		const value = e.target.value;
		setPublicKey(value);
		setError(isValidPublicKey(value) ? '' : 'Invalid public key');
	};

	return (
		<section className="cd_we_add_public_key">
			<div className="cd_we_input_label">Public Key</div>
			<input value={publicKey} onChange={onChange} placeholder="Enter public key" />
			<div className="cd_error_text">{error}</div>
			<Button onClick={onAddPublicKey} disabled={Boolean(error)}>
				Add
			</Button>
		</section>
	);
};
