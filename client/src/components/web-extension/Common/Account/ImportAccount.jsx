import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addLegacyAccount } from '@cd/components/hooks/useServiceWorker';
import useGetWallets from '@cd/hooks/useGetWallets';
import './ImportAccount.scss';

const ImportAccount = () => {
	const navigate = useNavigate();
	const [, loadWallets] = useGetWallets();

	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState();
	const [secretKey, setSecretKey] = useState();
	const [error, setError] = useState('');

	const onImportAccount = async () => {
		try {
			setIsLoading(true);
			await addLegacyAccount(name, secretKey);
			await loadWallets();
			setIsLoading(false);
			navigate('/');
		} catch (error) {
			setError('Invalid key');
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
			<div className="cd_we_input_label">Secret Key</div>
			<textarea
				placeholder="Enter your secret key"
				className="secret-key-input"
				value={secretKey}
				onChange={(e) => setSecretKey(e.target.value)}
			/>
			{error && <div className="cd_error_text">{error}</div>}
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
