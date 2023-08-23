import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import HistoryIcon from '@cd/assets/image/ic-history.svg';
import { getValidators, validatorSelector } from '@cd/selectors/validator';
import useBalanceVisible from '@cd/hooks/useBalanceVisible';
import { toFormattedNumber } from '@cd/helpers/format';
import { useStakedHistory, useStakeFromValidators } from '@cd/hooks/useStakeDeploys';
import { MiddleTruncatedText } from '@cd/common/MiddleTruncatedText';
import { ENTRY_POINT_REDELEGATE } from '@cd/constants/key';
import { useNavigate } from 'react-router-dom';
import Grid from '../../Common/Grid';
import { UndelegateButton } from './UndelegateButton';
import { RewardInfo } from './RewardInfo';

import './StakingInfo.scss';

const STAKING_INFO_METADATA = {
	left: [
		{ key: 'name', type: 'primary', wrapperComponent: MiddleTruncatedText },
		{ component: UndelegateButton, value: 'Undelegate', props: { text: 'Undelegate' } },
	],
	right: [
		{ key: 'stakedAmountDisplay', type: 'primary', suffix: 'CSPR' },
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
		{ key: 'name', type: 'primary', wrapperComponent: MiddleTruncatedText },
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

const VIEWS = {
	history: { key: 'history', metadata: STAKING_HISTORY_METADATA },
	rewards: { key: 'rewards' },
	info: { key: 'info', metadata: STAKING_INFO_METADATA },
};

export const StakingInfo = ({ publicKey }) => {
	const stackingList = useStakeFromValidators(publicKey);
	const { isBalanceVisible } = useBalanceVisible();
	const navigate = useNavigate();
	const historyList = useStakedHistory();
	const { loading: isLoadingValidators } = useSelector(validatorSelector);
	const validators = useSelector(getValidators());

	const [view, setView] = useState(VIEWS.info);

	const normalizedStackingList = useMemo(() => {
		return stackingList.map((item) => {
			return {
				...item,
				stakedAmountDisplay: isBalanceVisible ? toFormattedNumber(item.stakedAmount) : '*****',
			};
		});
	}, [isBalanceVisible, stackingList])

	const normalizedHistories = useMemo(
		() => {
			return historyList.map((history) => {

				return {
					...history,
					entryPoint: history.entryPoint === ENTRY_POINT_REDELEGATE ? `redelegate to ${history.newValidatorName}` : history.entryPoint,
				};
			});
		},
		[historyList]
	);

	return (
		<div className="cd_we_staking_info">
			<div className="cd_we_staking_info_header">
				<div
					className={cn('cd_we_staking_info_title', { active: view === VIEWS.info })}
					onClick={() => setView(VIEWS.info)}
				>
					Staked Info
				</div>
				<div
					className={cn('cd_we_staking_info_title', { active: view === VIEWS.rewards })}
					onClick={() => setView(VIEWS.rewards)}
				>
					Rewards
				</div>
				<HistoryIcon
					className={cn('cd_we_btn_history', { active: view === VIEWS.history })}
					onClick={() => setView(VIEWS.history)}
				/>
			</div>
			{view.key === VIEWS.rewards.key ? (
				<RewardInfo publicKey={publicKey} />
			) : (
				<Grid
					onRowClick={(value) => {
						const foundValidator = validators.find((validator) => validator.validatorPublicKey === value.validator);

						navigate('/staking', {
							state: {
								validator: foundValidator
							},
						});
					}}
					data={view.key === VIEWS.info.key ? normalizedStackingList : normalizedHistories}
					metadata={view.metadata}
					className="overflow_auto hide_scroll_bar"
					isLoading={isLoadingValidators}
				/>
			)}
		</div>
	);
};
