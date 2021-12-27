import React from 'react';
import './index.scss';

export const SendReceive = () => {
	return (
		<div className="cd_we_send_receive_buttons">
			<div className="cd_we_send_receive_item">
				<div className="cd_we_send_receiver_icon">
					<i className="bi bi-arrow-up" />
				</div>
				<div>Send</div>
			</div>
			<div className="cd_we_send_receive_item">
				<div className="cd_we_send_receiver_icon">
					<i className="bi bi-arrow-down" />
				</div>
				<div>Receive</div>
			</div>
		</div>
	);
};
