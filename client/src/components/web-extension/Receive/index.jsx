import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode.react';
import { Button } from 'react-bootstrap';
import { getPublicKey } from '../../../selectors/user';
import './Receive.scss';

const Receive = () => {
	//State
	const [copyText, setCopyText] = useState('Copy');

	//Selector
	const publicKey = useSelector(getPublicKey);

	//Function
	const onClickCopy = () => {
		navigator.clipboard.writeText(publicKey);
		setCopyText('Copied');
		setTimeout(() => {
			setCopyText('Copy');
		}, 1000);
	};

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
				<Button onClick={onClickCopy}>{copyText}</Button>
			</div>
		</section>
	);
};

export default Receive;
