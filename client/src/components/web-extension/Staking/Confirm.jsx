import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ServiceWorkerRequired from '@cd/components/hocs/ServiceWorkerRequired';
import { getStakeDeploy } from '../../../services/stakeServices';
import { getPublicKey } from '../../../selectors/user';
import { pushStakeToLocalStorage } from '../../../actions/stakeActions';
import { toFormattedNumber } from '../../../helpers/format';
import { useConfirmDeploy } from '../../hooks/useConfirmDeploy';
import { ENTRY_POINT_DELEGATE, ENTRY_POINT_UNDELEGATE } from '../../../constants/key';
import Copy from '../../Common/Button/Copy';
import './Confirm.scss';

export const Confirm = () => {
	// Hook
	const { state } = useLocation();
	const { stake = {} } = state || {};
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { executeDeploy, isDeploying } = useConfirmDeploy();

	// Selector
	const publicKey = useSelector(getPublicKey);

	// Function
	const onConfirm = async () => {
		const entryPoint = stake.action === 'undelegate' ? ENTRY_POINT_UNDELEGATE : ENTRY_POINT_DELEGATE;

		const buildDeployFn = (network) =>
			getStakeDeploy({
				fromAddress: publicKey,
				validator: stake.validator,
				fee: stake.fee,
				amount: stake.amount,
				entryPoint,
				network,
			});
		const { deployHash, signedDeploy } = await executeDeploy(buildDeployFn, publicKey, stake.validator);
		if (deployHash) {
			dispatch(
				pushStakeToLocalStorage(publicKey, {
					amount: stake.amount,
					entryPoint,
					fee: stake.fee,
					fromAddress: publicKey,
					validator: stake.validator,
					deployHash: deployHash,
					status: 'pending',
					timestamp: signedDeploy.deploy.header.timestamp,
				}),
			);
			navigate('/staking', { replace: true });
		}
	};

	return (
		<ServiceWorkerRequired>
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

				<Button onClick={onConfirm} disabled={isDeploying}>
					{stake.action === 'undelegate' ? 'Undelegate' : 'Delegate'}
				</Button>
			</section>
		</ServiceWorkerRequired>
	);
};
