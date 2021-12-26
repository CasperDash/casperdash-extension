import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

export const SendReceive = () => {
	const navigate = useNavigate();

	const onReceiveClick = () => {
		navigate('/receive', { state: { name: 'Receive' } });
	};

	const onSendClick = () => {
		navigate('/send', { state: { name: 'Send' } });
	};
	return (
		<div className="cd_we_send_receive_buttons">
			<div className="cd_we_send_receive_item" onClick={onSendClick}>
				<div className="cd_we_send_receiver_icon">
					<i className="bi bi-arrow-up" />
				</div>
				<div>Send</div>
			</div>
			<div className="cd_we_send_receive_item" onClick={onReceiveClick}>
				<div className="cd_we_send_receiver_icon">
					<i className="bi bi-arrow-down" />
				</div>
				<div>Receive</div>
			</div>
		</div>
	);
};
