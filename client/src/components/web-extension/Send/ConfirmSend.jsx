import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getPublicKey } from '../../../selectors/user';
import { getSignedTransferTokenDeploy } from '../../../services/tokenServices';
import { getSignedTransferDeploy } from '../../../services/userServices';
import { toFormattedCurrency, toFormattedNumber } from '../../../helpers/format';

const ConfirmSend = ({ token }) => {
	const { symbol, sendAmount: amount, transferFee: fee, toAddress, transferId, address, decimals, price } = token;

	//Selector
	const publicKey = useSelector(getPublicKey);

	//Hook
	const navigate = useNavigate();

	//State
	const [error, setError] = useState();

	//Function
	const navigateToTokenPage = () => {
		navigate('/dashboard', { replace: true });
	};

	const onSendTransaction = async () => {
		const signedDeploy =
			token.address === 'CSPR'
				? await getSignedTransferDeploy({
						fromAddress: publicKey,
						toAddress,
						amount,
						transferId,
						fee,
				  })
				: await getSignedTransferTokenDeploy({
						fromAddress: publicKey,
						toAddress,
						amount,
						contractInfo: { address, decimals },
						fee,
				  });
		if (!signedDeploy || signedDeploy.error) {
			setError(signedDeploy.error.message);
			return;
		}
		navigateToTokenPage();
	};

	return (
		<div className="cd_we_confirm">
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Asset</div>
				<div>{symbol}</div>
			</div>
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Transfer Amount</div>
				<div>
					{toFormattedNumber(amount)} ({toFormattedCurrency(amount * price)})
				</div>
			</div>
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Network Fee</div>
				<div>{fee} CSPR</div>
			</div>
			<div className="cd_we_confirm_row">
				<div>Receiving Address</div>
				<div className="cd_we_confirm_address">{toAddress}</div>
			</div>
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Transfer ID</div>
				<div>{transferId}</div>
			</div>
			<div className="cd_we_confirm_row cd_error_text">{error}</div>
			<div className="cd_we_confirm_buttons">
				<Button variant="secondary" onClick={navigateToTokenPage}>
					Cancel
				</Button>
				<Button onClick={onSendTransaction}>Send</Button>
			</div>
		</div>
	);
};

export default ConfirmSend;
