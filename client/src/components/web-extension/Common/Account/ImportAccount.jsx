import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addLegacyAccount } from '@cd/components/hooks/useServiceWorker';
import { onBindingAuthInfo } from '@cd/actions/userActions';
import './ImportAccount.scss';
import { useDispatch } from 'react-redux';

const ImportAccount = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState();
	const [secretKey, setSecretKey] = useState();
	const [error, setError] = useState({});

	const onImportAccount = async () => {
		try {
			if (!name) {
				setError({ name: 'Name is required' });
				return;
			}
			setIsLoading(true);
			const { publicKey, userDetails } = await addLegacyAccount(name, secretKey);

			dispatch(onBindingAuthInfo({ publicKey, user: userDetails }));
			setIsLoading(false);
			navigate('/');
		} catch (error) {
			setError({ privateKey: 'Invalid key' });
			setIsLoading(false);
		}
	};
	return (
		<section className="cd_we_import_account">
			<div className="description">
				Imported account are viewable in your wallet but are not recoverable with your CasperDash Secret
				Recovery Phrase
			</div>
			<div className="cd_we_input_label">Name</div>
			<input placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
			{error.name && <div className="cd_error_text">{error.name}</div>}
			<div className="cd_we_input_label">Secret Key</div>
			<textarea
				placeholder="Enter your secret key"
				className="secret-key-input"
				value={secretKey}
				onChange={(e) => setSecretKey(e.target.value)}
			/>
			{error.privateKey && <div className="cd_error_text">{error.privateKey}</div>}
			<div className="actions">
				<Button variant="normal" onClick={() => navigate('/')} disabled={isLoading}>
					Cancel
				</Button>
				<Button onClick={onImportAccount} disabled={isLoading}>
					Import
				</Button>
			</div>
		</section>
	);
};

export default ImportAccount;
