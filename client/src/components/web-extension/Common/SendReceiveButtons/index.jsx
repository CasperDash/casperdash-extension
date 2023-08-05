import React from 'react';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@cd/assets/image/send-icon.svg';
import ReceiveIcon from '@cd/assets/image/receive-icon.svg';
import './index.scss';
import { useSelector } from 'react-redux';
import { getPublicKeyAndLoginOptions } from '@cd/selectors/user';

export const SendReceive = ({ token }) => {
	const navigate = useNavigate();
	const { publicKey } = useSelector(getPublicKeyAndLoginOptions);

	const onReceiveClick = () => {
		navigate('/receive', { state: { name: 'Receive' } });
	};

	const onSendClick = () => {
		navigate('/send', { state: { name: 'Send', token } });
	};

	const onBuyClick = () => {
		window.open(
			`https://app.demo.ramp.network?hostApiKey=btryzq9sfpr444frq7h3wr3shpj3ov653go3vrgm&hostAppName=CasperDash&hostLogoUrl=https://github.com/CasperDash/casperdash-materials/blob/3b92dd04768a96946e054548c12d9281e56b17d4/media-kit/rw-lg.png?raw=true&userAddress=${publicKey}`,
		);
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
			<div className="cd_we_send_receive_item" onClick={onBuyClick}>
				<div className="cd_we_send_receiver_icon">
					<ReceiveIcon />
				</div>
				<div className="cd_we_send_receiver_text">Buy</div>
			</div>
		</div>
	);
};
