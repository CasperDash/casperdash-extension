import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SendIcon from '@cd/assets/image/send-icon.svg';
import ReceiveIcon from '@cd/assets/image/receive-icon.svg';
import ReverseIcon from '@cd/assets/image/reverse.svg';
import { reset as resetSwapData } from '@cd/actions/swapActions';

import './index.scss';

export const SendReceive = ({ token }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onReceiveClick = () => {
		navigate('/receive', { state: { name: 'Receive' } });
	};

	const onSendClick = () => {
		navigate('/send', { state: { name: 'Send', token } });
	};

	const onSwapClick = () => {
		dispatch(resetSwapData());
		navigate('/swap', { state: { name: 'Swap' } });
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
			<div className="cd_we_send_receive_item" onClick={onSwapClick}>
				<div className="cd_we_send_receiver_icon">
					<ReverseIcon />
				</div>
				<div className="cd_we_send_receiver_text">Swap</div>
			</div>
		</div>
	);
};
