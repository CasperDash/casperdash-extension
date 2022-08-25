import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MiddleTruncatedText } from '@cd/common/MiddleTruncatedText';
import { useConfirmDeploy } from '../../hooks/useConfirmDeploy';
import { getPublicKey } from '../../../selectors/user';
import { pushTransferToLocalStorage } from '../../../actions/deployActions';
import { getTransferTokenDeploy } from '../../../services/tokenServices';
import { getTransferDeploy } from '../../../services/userServices';
import { toFormattedCurrency, toFormattedNumber } from '../../../helpers/format';

const ConfirmSend = ({ token }) => {
	const { symbol, sendAmount: amount, transferFee: fee, toAddress, transferId, address, decimals, price } = token;

	//Selector
	const publicKey = useSelector(getPublicKey);

	//Hook
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { executeDeploy, isDeploying } = useConfirmDeploy();

	//Function
	const navigateToTokenPage = () => {
		navigate('/token', { replace: true, state: { name: symbol, token } });
	};

	const buildTransferDeploy = (transferDetails) => {
		return token.address === 'CSPR'
			? getTransferDeploy({
					...transferDetails,
					transferId,
			  })
			: getTransferTokenDeploy({
					...transferDetails,
					contractInfo: { address, decimals },
			  });
	};

	const onSendTransaction = async () => {
		const transferDetails = {
			fromAddress: publicKey,
			toAddress,
			amount,
			fee,
		};
		const buildDeployFn = () => buildTransferDeploy(transferDetails);

		const { deployHash, signedDeploy } = await executeDeploy(
			buildDeployFn,
			transferDetails.fromAddress,
			transferDetails.toAddress,
		);
		if (deployHash) {
			dispatch(
				pushTransferToLocalStorage(publicKey, {
					...transferDetails,
					deployHash: deployHash,
					status: 'pending',
					timestamp: signedDeploy.deploy.header.timestamp,
					transferId: transferId,
					address,
					decimals,
					symbol,
				}),
			);
			navigateToTokenPage();
		}
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
				<div className="cd_we_confirm_address">
					<MiddleTruncatedText>{toAddress}</MiddleTruncatedText>
				</div>
			</div>
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Transfer ID</div>
				<div>{transferId}</div>
			</div>

			<div className="cd_we_confirm_buttons">
				<Button onClick={onSendTransaction} disabled={isDeploying}>
					{isDeploying ? 'Sending' : 'Sign'}
				</Button>
			</div>
		</div>
	);
};

export default ConfirmSend;
