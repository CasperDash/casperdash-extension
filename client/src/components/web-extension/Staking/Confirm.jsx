import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import _get from 'lodash-es/get';
import { Button } from 'react-bootstrap';
import ServiceWorkerRequired from '@cd/components/hocs/ServiceWorkerRequired';
import { getStakeDeploy } from '@cd/services/stakeServices';
import { getPublicKey } from '@cd/selectors/user';
import { pushStakeToLocalStorage } from '@cd/actions/stakeActions';
import { toFormattedNumber } from '@cd/helpers/format';
import { useConfirmDeploy } from '@cd/hooks/useConfirmDeploy';
import { ENTRY_POINT_REDELEGATE } from '@cd/constants/key';
import ValidatorItem from '@cd/common/SelectValidator/ValidatorItem';
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
		const entryPoint = stake.action;

		const buildDeployFn = (network) =>
			getStakeDeploy({
				fromAddress: publicKey,
				validator: _get(stake, 'validator.publicKey'),
				newValidator: _get(stake, 'newValidator.publicKey'),
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
					validator: _get(stake, 'validator.publicKey'),
					deployHash: deployHash,
					status: 'pending',
					timestamp: signedDeploy.deploy.header.timestamp,
					newValidator: _get(stake, 'newValidator.publicKey'),
					newValidatorName: _get(stake, 'newValidator.name'),
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
						<ValidatorItem
							name={_get(stake, 'validator.name')}
							address={_get(stake, 'validator.publicKey')}
							icon={_get(stake, 'validator.icon')}
						/>
						<Copy value={_get(stake, 'validator.publicKey')} />
					</div>
				</div>
				{
					stake.action === ENTRY_POINT_REDELEGATE && (
						<div className="cd_we_confirm_row">
							<div className="cd_we_input_label">Validator</div>
							<div className="cd_we_stake_validator_address">
								<ValidatorItem
									name={_get(stake, 'newValidator.name')}
									address={_get(stake, 'newValidator.publicKey')}
									icon={_get(stake, 'newValidator.icon')}
								/>
								<Copy value={_get(stake, 'newValidator.publicKey')} />
							</div>
						</div>
					)
				}
				<div className="cd_we_confirm_row">
					<div className="cd_we_input_label">Amount</div>
					<div>{toFormattedNumber(stake.amount)} CSPR</div>
				</div>
				<div className="cd_we_confirm_row">
					<div className="cd_we_input_label">Network Fee</div>
					<div>{toFormattedNumber(stake.fee)} CSPR</div>
				</div>
				<div className="cd_we_confirm_row">
					<div className="cd_we_input_label">Entry Point</div>
					<div>{stake.action}</div>
				</div>

				<Button onClick={onConfirm} disabled={isDeploying} className={'cd_we_deploy_button'}>
					{stake.action}
				</Button>
			</section>
		</ServiceWorkerRequired>
	);
};
