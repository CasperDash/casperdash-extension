import React, { useState } from 'react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { ONE_MINUTE } from '@cd/constants/time';
import CopyButton from '../CopyButton';

import './PrivateKey.scss';

const PrivateKey = () => {
	const [isBlurred, setIsBlurred] = useState(true);
	const location = useLocation();
	const {
		state: { accountName, privateKey },
	} = location;

	return (
		<section className="cd_we_import_account">
			<div className="cd_we_input_label">Name</div>
			<div className="cd_we_input_value">{accountName}</div>
			<div className="cd_we_input_label">Private Key</div>
			<div 
			className={
				clsx('cd_we_private_key', {
					'cd_we_private_key__blur': isBlurred,
				})
			}
			onClick={() => setIsBlurred(false)}
			>
				<div 
					className={
						clsx({
							'cd_we_private_key--blurred': isBlurred,
						})
					}
				>
					{privateKey}
				</div>
				{
					isBlurred && (
						<div className="cd_we_private_key__blur-overlay">
							Click to reveal secret private key
						</div>
					)
				}
			</div>

			<div className="actions">
				<CopyButton text={privateKey} delay={ONE_MINUTE}/>
			</div>
		</section>
	);
};

export default PrivateKey;
