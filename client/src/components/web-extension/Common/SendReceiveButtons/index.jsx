import React from 'react';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@cd/assets/image/send-icon.svg';
import ReceiveIcon from '@cd/assets/image/receive-icon.svg';
import BuyIcon from '@cd/assets/image/buy-icon.svg';
import { useSelector } from 'react-redux';
import { getPublicKeyAndLoginOptions } from '@cd/selectors/user';
import { useConfiguration } from '@cd/hooks/useConfiguration';

import './index.scss';

export const SendReceive = ({ token }) => {
	const navigate = useNavigate();
	const { publicKey } = useSelector(getPublicKeyAndLoginOptions);
	const { getConfig } = useConfiguration();

	const onReceiveClick = () => {
		navigate('/receive', { state: { name: 'Receive' } });
	};

	const onSendClick = () => {
		navigate('/send', { state: { name: 'Send', token } });
	};

	const onBuyClick = () => {
		window.open(
			`https://app.ramp.network?hostApiKey=6t8ty5y2jvbyam46v5d7g6pdx3hnkhhs5sg4gxd2&hostAppName=CasperDash&hostLogoUrl=https://github.com/CasperDash/casperdash-materials/blob/3b92dd04768a96946e054548c12d9281e56b17d4/media-kit/rw-lg.png?raw=true&userAddress=${publicKey}&swapAsset=CASPER_CSPR`,
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
			{getConfig('ENABLE_BUY') && (
				<div className="cd_we_send_receive_item" onClick={onBuyClick}>
					<div className="cd_we_send_receiver_icon">
						<BuyIcon />
					</div>
					<div className="cd_we_send_receiver_text">Buy</div>
				</div>
			)}
		</div>
	);
};
