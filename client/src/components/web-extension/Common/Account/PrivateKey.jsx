import React from 'react';
import { useLocation } from 'react-router-dom';
import { DownloadButton } from '../DownloadButton';

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
				<DownloadButton text={privateKey} fileName={`${accountName?.replace(' ', '_')}_private_key.pem`} />
			</div>
		</section>
	);
};

export default PrivateKey;
