import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { approveSignMessageRequest, parseMessageData, rejectSignMessageRequest } from '@cd/components/hooks/useServiceWorker';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';

import './index.scss';

const DappSignMessageRequest = () => {
	const [messageData, setMessageData] = useState({});

	useEffect(() => {
		const loadMessageData = async () => {
			const messageData = await parseMessageData();

			setMessageData(messageData);
		};

		loadMessageData();
	}, []);

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

	return (
		<div className="cd_we_sign_message_container">
			<div className="cd_we_sign_message_title">
				<h1>Signature Request</h1>
			</div>
			<div className="cd_we_sign_message">
				<div className="field">
					<span>Message</span>
					<div className="long_text">
						<MiddleTruncatedText end={4}>{messageData.messageString}</MiddleTruncatedText>
					</div>
				</div>
				<div className="field">
					<span>Signing Key</span>
					<div className="long_text">
						<MiddleTruncatedText end={4}>{messageData.signingKey}</MiddleTruncatedText>
					</div>
				</div>
			</div>
			<div className="cd_we_sign_message_buttons">
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
