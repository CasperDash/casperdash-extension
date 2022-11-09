import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import './PrivateKey.scss';

const PrivateKey = () => {
	const location = useLocation();
	const {
		state: { accountName, privateKey },
	} = location;

	return (
		<section className="cd_we_import_account">
			<div className="cd_we_input_label">Name</div>
			<div className="cd_we_input_value">{accountName}</div>
			<div className="cd_we_input_label">Private Key</div>
			<div className="cd_we_private_key">{privateKey}</div>

			<div className="actions">
				<Button onClick={() => navigator.clipboard.writeText(privateKey)}>Copy</Button>
			</div>
		</section>
	);
};

export default PrivateKey;
