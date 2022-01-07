import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import useLedger from '../../hooks/useLedger';
import { getPublicKey, getConnectionType } from '../../../selectors/user';
import { getLedgerOptions } from '../../../selectors/ledgerOptions';
import { putDeploy, pushTransferToLocalStorage } from '../../../actions/deployActions';
import { getSignedTransferTokenDeploy } from '../../../services/tokenServices';
import { getSignedTransferDeploy } from '../../../services/userServices';
import { toFormattedCurrency, toFormattedNumber } from '../../../helpers/format';

const ConfirmSend = ({ token }) => {
	const { symbol, sendAmount: amount, transferFee: fee, toAddress, transferId, address, decimals, price } = token;

	//Selector
	const publicKey = useSelector(getPublicKey);
	const connectionType = useSelector(getConnectionType);
	const ledgerOptions = useSelector(getLedgerOptions);

	//Hook
	const navigate = useNavigate();
	const dispatch = useDispatch();

	//Function
	const navigateToTokenPage = () => {
		navigate('/token', { replace: true, state: { name: symbol, token } });
	};

	const onSendTransaction = async () => {
		try {
			const transferDetails = {
				fromAddress: publicKey,
				toAddress,
				amount,
				fee,
			};
			const signedDeploy =
				token.address === 'CSPR'
					? await getSignedTransferDeploy(
							{
								...transferDetails,
								transferId,
							},
							ledgerOptions,
					  )
					: await getSignedTransferTokenDeploy(
							{
								...transferDetails,
								contractInfo: { address, decimals },
							},
							ledgerOptions,
					  );
			const { data, error } = await dispatch(putDeploy(signedDeploy));
			if (error) {
				throw new Error(`Error on sending. Please try again later.`);
			}
			toast.success(`Deploy hash: ${data.deployHash}`);
			dispatch(
				pushTransferToLocalStorage(publicKey, {
					...transferDetails,
					deployHash: data.deployHash,
					status: 'pending',
					timestamp: signedDeploy.deploy.header.timestamp,
					transferId: transferId,
					address,
					decimals,
					symbol,
				}),
			);
			navigateToTokenPage();
		} catch (error) {
			toast.error(error.message);
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
				<div className="cd_we_confirm_address">{toAddress}</div>
			</div>
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Transfer ID</div>
				<div>{transferId}</div>
			</div>

			<div className="cd_we_confirm_buttons">
				<Button onClick={onSendTransaction}>Send</Button>
			</div>
		</div>
	);
};

export default ConfirmSend;
