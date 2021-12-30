import React from 'react';
import { useNavigate } from 'react-router-dom';
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
					<svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M6.4162 10.7646L14.5 2.68079M14.5 2.68079L22.5838 10.7646M14.5 2.68079V19.3819"
							stroke="#FA2852"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							opacity="0.2"
							d="M8 24.7606H21"
							stroke="#FA2852"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<div className="cd_we_send_receiver_text">Send</div>
			</div>
			<div className="cd_we_send_receive_item" onClick={onReceiveClick}>
				<div className="cd_we_send_receiver_icon">
					<svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M6.4162 11.2982L14.5 19.382M14.5 19.382L22.5838 11.2982M14.5 19.382V2.68081"
							stroke="#FA2852"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							opacity="0.2"
							d="M8 24.7606H21"
							stroke="#FA2852"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<div className="cd_we_send_receiver_text">Receive</div>
			</div>
		</div>
	);
};
