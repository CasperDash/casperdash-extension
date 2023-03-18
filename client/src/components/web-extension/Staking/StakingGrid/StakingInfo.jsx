import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HistoryIcon from '@cd/assets/image/ic-history.svg';
import { getStakingRewards } from '@cd/actions/userActions';
import { userStakingRewardSelector } from '@cd/selectors/user';
import { validatorSelector } from '../../../../selectors/validator';
import { useStakedHistory, useStakeFromValidators } from '../../../hooks/useStakeDeploys';
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
		{
			key: 'pendingAmount',
			type: 'secondary',
			format: 'number',
			suffix: 'CSPR (pending)',
			shouldDisplay: (value) => value && value !== 0,
		},
	],
};

const STAKING_HISTORY_METADATA = {
	left: [
		{ key: 'validator', type: 'primary', wrapperComponent: MiddleTruncatedText },
		{ key: 'entryPoint', type: 'secondary' },
	],
	right: [
		{ key: 'amount', type: 'primary', format: 'number', suffix: 'CSPR' },
		{
			key: 'status',
			type: 'secondary',
		},
	],
};

const REWARDS_METADATA = {
	left: [
		{ key: 'validatorPublicKey', type: 'primary', wrapperComponent: MiddleTruncatedText },
		{ key: 'era', type: 'secondary', format: 'number' },
	],
	right: [
		{ key: 'amount', type: 'primary', format: 'mote', suffix: 'CSPR' },
		{
			key: 'createdAt',
			type: 'secondary',
			format: 'date',
			formatOptions: { timeStyle: 'short', dateStyle: 'short' },
		},
	],
};

const VIEWS = {
	history: { key: 'history', metadata: STAKING_HISTORY_METADATA },
	rewards: { key: 'rewards', metadata: REWARDS_METADATA },
	info: { key: 'info', metadata: STAKING_INFO_METADATA },
};

export const StakingInfo = ({ publicKey }) => {
	const dispatch = useDispatch();
	const { data: stakingRewards } = useSelector(userStakingRewardSelector);
	const stackingList = useStakeFromValidators(publicKey);
	const historyList = useStakedHistory();
	const { loading: isLoadingValidators } = useSelector(validatorSelector);

	const [view, setView] = useState(VIEWS.info);

	const data = useMemo(() => {
		switch (view.key) {
			case VIEWS.history.key:
				return historyList;
			case VIEWS.rewards.key:
				return stakingRewards?.docs || [];
			default:
				return stackingList;
		}
	}, [view.key, historyList, stackingList, stakingRewards?.docs]);

	useEffect(() => {
		if (view.key === VIEWS.rewards.key) {
			dispatch(getStakingRewards(publicKey));
		}
	}, [view.key, dispatch, publicKey]);

	return (
		<div className="cd_we_staking_info">
			<div className="cd_we_staking_info_header">
				<div
					className={`cd_we_staking_info_title ${view === VIEWS.info ? 'active' : ''}`}
					onClick={() => setView(VIEWS.info)}
				>
					Staked Info
				</div>
				<div
					className={`cd_we_staking_info_title ${view === VIEWS.rewards ? 'active' : ''}`}
					onClick={() => setView(VIEWS.rewards)}
				>
					Rewards
				</div>
				<HistoryIcon
					className={`cd_we_btn_history ${view === VIEWS.history ? 'active' : ''}`}
					onClick={() => setView(VIEWS.history)}
				/>
			</div>
			<Grid
				data={data}
				metadata={view.metadata}
				className="overflow_auto hide_scroll_bar"
				isLoading={isLoadingValidators}
			/>
		</div>
	);
};
