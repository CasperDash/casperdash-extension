import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStakingRewards } from '@cd/actions/userActions';
import { userStakingRewardSelector } from '@cd/selectors/user';
import { MiddleTruncatedText } from '../../../Common/MiddleTruncatedText';
import Grid from '../../Common/Grid';
import './StakingInfo.scss';

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

export const RewardInfo = ({ publicKey }) => {
	const dispatch = useDispatch();
	const { isLoading } = useSelector(userStakingRewardSelector);
	const [rewardPage, setRewardPage] = useState(1);
	const [rewardData, setRewardData] = useState({});

	useEffect(() => {
		const loadReward = async () => {
			const { data } = await dispatch(getStakingRewards(publicKey, 1));
			setRewardData(data);
		};
		loadReward();
	}, [dispatch, publicKey]);

	const fetchMoreData = async () => {
		const { data } = await dispatch(getStakingRewards(publicKey, rewardPage + 1));
		setRewardData((rewards) => ({ ...data, docs: rewards.docs.concat(data.docs) }));
		setRewardPage((page) => page + 1);
	};

	return (
		<Grid
			isInfiniteScroll
			infiniteScrollProps={{
				dataLength: rewardData?.docs?.length || 0,
				next: fetchMoreData,
				hasMore: rewardData?.hasNextPage,
				loader: <p>Loading...</p>,
				height: 'calc(100vh - 390px)',
			}}
			data={rewardData?.docs}
			metadata={REWARDS_METADATA}
			className="overflow_auto hide_scroll_bar"
			isLoading={isLoading}
		/>
	);
};
