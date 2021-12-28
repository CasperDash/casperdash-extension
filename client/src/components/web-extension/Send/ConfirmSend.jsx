import React from 'react';
import { Button } from 'react-bootstrap';

const ConfirmSend = ({ token }) => {
	const { symbol, sendAmount, transferFee, toAddress, transferId } = token;
	return (
		<div className="cd_we_confirm">
			<div className="cd_we_confirm_row">
				<div>Asset</div>
				<div>{symbol}</div>
			</div>
			<div className="cd_we_confirm_row">
				<div>Transfer Amount</div>
				<div>{sendAmount}</div>
			</div>
			<div className="cd_we_confirm_row">
				<div>Network Fee</div>
				<div>{transferFee}</div>
			</div>
			<div className="cd_we_confirm_row">
				<div>Receiving Address</div>
				<div className="cd_we_confirm_address">{toAddress}</div>
			</div>
			<div className="cd_we_confirm_row">
				<div>Transfer ID</div>
				<div>{transferId}</div>
			</div>
			<div className="cd_we_confirm_buttons">
				<Button variant="secondary">Cancel</Button>
				<Button>Send</Button>
			</div>
		</div>
	);
};

export default ConfirmSend;
