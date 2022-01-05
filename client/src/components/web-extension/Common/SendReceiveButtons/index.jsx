import React from 'react';
import { useNavigate } from 'react-router-dom';
import SendIcon from 'assets/image/send-icon.svg';
import ReceiveIcon from 'assets/image/receive-icon.svg';
import './index.scss';

export const SendReceive = ({ token }) => {
	const navigate = useNavigate();

	const onReceiveClick = () => {
		navigate('/receive', { state: { name: 'Receive' } });
	};

	const onSendClick = () => {
		navigate('/send', { state: { name: 'Send', token } });
	};

	return (
		<div className="cd_we_send_receive_buttons">
			<div className="cd_we_send_receive_item" onClick={onSendClick}>
				<div className="cd_we_send_receiver_icon">
					<SendIcon />
				</div>
				<div className="cd_we_send_receiver_text">Send</div>
			</div>
			<div className="cd_we_send_receive_item" onClick={onReceiveClick}>
				<div className="cd_we_send_receiver_icon">
					<ReceiveIcon />
				</div>
				<div className="cd_we_send_receiver_text">Receive</div>
			</div>
		</div>
	);
};
