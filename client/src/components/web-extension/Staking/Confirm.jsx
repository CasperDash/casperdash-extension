import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getSignedStakeDeploy } from '../../../services/stakeServices';
import { getPublicKey } from '../../../selectors/user';
import { putDeploy } from '../../../actions/deployActions';
import { pushStakeToLocalStorage } from '../../../actions/stakeActions';
import { toFormattedNumber } from '../../../helpers/format';
import { ENTRY_POINT_DELEGATE, ENTRY_POINT_UNDELEGATE } from '../../../constants/stack';
import Copy from '../../Common/Button/Copy';
import './Confirm.scss';

export const Confirm = () => {
	// State
	const [errorMessage, setErrorMessage] = useState();

	// Hook
	const { state } = useLocation();
	const { stake = {} } = state || {};
	const dispatch = useDispatch();

	const publicKey = useSelector(getPublicKey);

	const onConfirm = async () => {
		const entryPoint = stake.action === 'undelegate' ? ENTRY_POINT_UNDELEGATE : ENTRY_POINT_DELEGATE;
		try {
			const signedDeploy = await getSignedStakeDeploy({
				fromAddress: publicKey,
				validator: stake.validator,
				fee: stake.fee,
				amount: stake.amount,
				entryPoint,
			});
			const { data } = await dispatch(putDeploy(signedDeploy));
			toast.success(`Deploy hash: ${data.deployHash}`);
			dispatch(
				pushStakeToLocalStorage(publicKey, {
					amount: stake.amount,
					entryPoint,
					fee: stake.fee,
					fromAddress: publicKey,
					validator: stake.validator,
					deployHash: data.deployHash,
					status: 'pending',
					timestamp: signedDeploy.deploy.header.timestamp,
				}),
			);
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	return (
		<section className="cd_we_deploy_details cd_we_single_section no_bottom_bar">
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Validator</div>
				<div className="cd_we_stake_validator_address">
					{stake.validator} <Copy value={stake.validator} />
				</div>
			</div>
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Amount</div>
				<div>{toFormattedNumber(stake.amount)} CSPR</div>
			</div>
			<div className="cd_we_confirm_row">
				<div className="cd_we_input_label">Network Fee</div>
				<div>{toFormattedNumber(stake.fee)} CSPR</div>
			</div>
			{errorMessage && <div className="cd_error_text">{errorMessage}</div>}
			<Button onClick={onConfirm}>{stake.action === 'undelegate' ? 'Undelegate' : 'Delegate'}</Button>
		</section>
	);
};
