import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { approveSignMessageRequest, parseMessageData, rejectSignMessageRequest } from '@cd/components/hooks/useServiceWorker';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';

import './style.scss';

const DappSignMessageRequest = () => {
	const [messageData, setMessageData] = useState({});

	const onOk = async () => {
		try {
			await approveSignMessageRequest();
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log(err);
		}
	};

	const onCancel = () => {
		rejectSignMessageRequest();
	};

	useEffect(() => {
		const loadMessageData = async () => {
			const messageData = await parseMessageData();

			setMessageData(messageData);
		};

		loadMessageData();
	}, []);

	return (
		<div className="cd_we_sign_message_container">
			<div className="cd_we_sign_message_title">
				<h1>Signature Request</h1>
			</div>
			<div className="cd_we_sign_message_fields">
				<div className="cd_we_sign_message_field">
					<span className="cd_we_sign_message_field__label">Signing Key</span>
					<div className="cd_we_sign_message_field__value">
						<p>
							{messageData.signingKey}
						</p>
					</div>
				</div>
				<div className="cd_we_sign_message_field">
					<span className="cd_we_sign_message_field__label">Message</span>
					<div className="cd_we_sign_message_field__value">
						{/* <MultilineTruncatedText>{messageData.messageString}</MultilineTruncatedText> */}
						<textarea readOnly rows="8" value={messageData.messageString} />
					</div>
				</div>
			</div>
			<div className="cd_we_sign_message_actions">
				<Button variant="primary" onClick={onOk}>
					Approve
				</Button>

				<Button variant="secondary" onClick={onCancel}>
					Reject
				</Button>
			</div>
		</div>
	);
};

export default withServiceWorkerRequired(DappSignMessageRequest);
