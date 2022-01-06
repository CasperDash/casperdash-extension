import React from 'react';
import { useSelector } from 'react-redux';
import { validatorSelector } from '../../../../selectors/validator';
import { useStakeFromValidators } from '../../../hooks/useStakeDeploys';
import { MiddleTruncatedText } from '../../../Common/MiddleTruncatedText';
import Grid from '../../Common/Grid';
import { UndelegateButton } from './UndelegateButton';
import './StakingInfo.scss';

const STAKING_INFO_METADATA = {
	left: [
		{ key: 'validator', type: 'primary', wrapperComponent: MiddleTruncatedText },
		{ component: UndelegateButton, value: 'Undelegate', props: { text: 'Undelegate' } },
	],
	right: [
		{ key: 'stakedAmount', type: 'primary', format: 'number', suffix: 'CSPR' },
		{ key: 'pendingAmount', type: 'secondary', format: 'number', suffix: 'CSPR' },
	],
};

export const StakingInfo = ({ publicKey }) => {
	const stackingList = useStakeFromValidators(publicKey);
	console.log(stackingList);
	const { loading: isLoadingValidators } = useSelector(validatorSelector);

	return (
		<div className="cd_we_staking_info">
			<div className="cd_we_staking_info_title">Staked Information</div>
			<Grid
				data={stackingList}
				metadata={STAKING_INFO_METADATA}
				className="overflow_auto hide_scroll_bar"
				isLoading={isLoadingValidators}
			/>
		</div>
	);
};
