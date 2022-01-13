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
		<section className="cd_we_receive_page cd_we_single_section no_bottom_bar">
			<div className="cd_we_receive_qr">
				<QRCode value={publicKey} bgColor={'transparent'} fgColor={'#232635'} size={166} />
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
