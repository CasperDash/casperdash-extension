import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStakingRewards } from '@cd/actions/userActions';
import { userStakingRewardSelector } from '@cd/selectors/user';
import { validatorsDetail } from '@cd/selectors/validator';
import { MiddleTruncatedText } from '../../../Common/MiddleTruncatedText';
import Grid from '../../Common/Grid';
import './StakingInfo.scss';

const REWARDS_METADATA = {
	left: [
		{ key: 'name', type: 'primary', wrapperComponent: MiddleTruncatedText },
		{ key: 'eraId', type: 'secondary', format: 'number' },
	],
	right: [
		{ key: 'amount', type: 'primary', format: 'mote', suffix: 'CSPR' },
		{
			key: 'timestamp',
			type: 'secondary',
			format: 'date',
			formatOptions: { timeStyle: 'short', dateStyle: 'short' },
		},
	],
};

export const RewardInfo = ({ publicKey }) => {
	const dispatch = useDispatch();
	const { isLoading } = useSelector(userStakingRewardSelector);
	const [rewardPage, setRewardPage] = useState(1);
	const [rewardData, setRewardData] = useState([]);
	const [hasNext, setHasNext] = useState(false);
	const { data: details } = useSelector(validatorsDetail);

	useEffect(() => {
		const loadReward = async () => {
			const { data } = await dispatch(getStakingRewards(publicKey, 1));

			setRewardData(data.data);
			setHasNext(() => data?.pages.find((page) => page.number > 1));
		};
		loadReward();
	}, [dispatch, publicKey]);

	const fetchMoreData = async () => {
		const { data } = await dispatch(getStakingRewards(publicKey, rewardPage + 1));
		setRewardData((rewards) => rewards.concat(data.data));
		setRewardPage((page) => page + 1);
		setHasNext(() => !!data?.pages.find((page) => page.number > rewardPage + 1));
	};

	const rewardsWithDetails = useMemo(() => {
		return (
			rewardData?.map((reward) => {
				const detail = details?.[reward.validatorPublicKey];
				return { ...reward, icon: detail?.logo, name: detail?.name || reward.validatorPublicKey };
			}) || []
		);
	}, [rewardData, details]);

	return (
		<Grid
			isInfiniteScroll
			infiniteScrollProps={{
				dataLength: rewardsWithDetails?.length || 0,
				next: fetchMoreData,
				hasMore: hasNext,
				loader: <p>Loading...</p>,
				height: 'calc(100vh - 390px)',
			}}
			data={rewardsWithDetails}
			metadata={REWARDS_METADATA}
			className="overflow_auto hide_scroll_bar"
			isLoading={isLoading}
		/>
	);
};
