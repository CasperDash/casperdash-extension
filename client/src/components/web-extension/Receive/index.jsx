import React from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode.react';
import { Button } from 'react-bootstrap';
import { getPublicKey } from '../../../selectors/user';
import './Receive.scss';

const Receive = () => {
	//Selector
	const publicKey = useSelector(getPublicKey);

	return (
		<section className="cd_we_receive_page">
			<div className="cd_we_receive_qr">
				<QRCode
					value={publicKey}
					bgColor={'transparent'}
					fgColor={'#CAD3F2'}
					size={166}
					className="cd_dark_theme_qrcode"
				/>
			</div>
			<div className="cd_we_receive_address">
				<div className="label">Receiving Address</div>
				<div className="value">{publicKey}</div>
			</div>
			<div className="cd_we_receive_actions">
				<Button>Share</Button>
				<Button>Copy</Button>
			</div>
		</section>
	);
};

export default Receive;
