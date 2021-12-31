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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-arrow-up"
						viewBox="0 0 16 16"
					>
						<path
							fillRule="evenodd"
							d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
						/>
					</svg>
				</div>
				<div className="cd_we_send_receiver_text">Send</div>
			</div>
			<div className="cd_we_send_receive_item" onClick={onReceiveClick}>
				<div className="cd_we_send_receiver_icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						className="bi bi-arrow-down"
						viewBox="0 0 16 16"
					>
						<path
							fillRule="evenodd"
							d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
						/>
					</svg>
				</div>
				<div className="cd_we_send_receiver_text">Receive</div>
			</div>
		</div>
	);
};
