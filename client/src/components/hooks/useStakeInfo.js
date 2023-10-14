import { useSelector } from 'react-redux';
import _get from 'lodash-es/get';
import { getValueByFormat } from '@cd/helpers/format';
import { getLatestMarketInfo } from '@cd/selectors/price';
import { useMemo } from 'react';
import { useGetUserUndelegating } from '@cd/web-extension/Staking/hooks/useGetAccountUndelegating';
import { moteToCspr } from '@cd/helpers/balance';
import { useStakeFromValidators } from './useStakeDeploys';
import { toCSPR } from '@cd/helpers/currency';

export const useStakeInfo = (publicKey) => {
	const stackingList = useStakeFromValidators(publicKey);
	const csprMarketInfo = useSelector(getLatestMarketInfo);

	const { data: undelegatingData = {} } = useGetUserUndelegating();

	return useMemo(() => {
		const totalStaked = stackingList ? stackingList.reduce((acc, cur) => acc + cur.stakedAmount, 0): 0;
		const totalStakedInFiat = totalStaked * _get(csprMarketInfo, 'price', 0);
		const formattedTotalStakedInFiat = getValueByFormat(totalStakedInFiat, { format: 'number' });
		const formattedTotalStaked = getValueByFormat(totalStaked, { format: 'number' });

		const bigTotalUndelegating = toCSPR(undelegatingData.total  || 0);

		const totalUndelegating = typeof bigTotalUndelegating === 'string' ? 0 : bigTotalUndelegating.toNumber();
		const totalUndelegatingInFiat = totalUndelegating * _get(csprMarketInfo, 'price', 0);
		const formattedTotalUndelegating = getValueByFormat(totalUndelegating, { format: 'number' });
		const formattedTotalUndelegatingInFiat = getValueByFormat(totalUndelegatingInFiat, { format: 'number' });

		return {
			totalStaked,
			totalStakedInFiat,
			formattedTotalStakedInFiat,
			formattedTotalStaked,
			totalUndelegating,
			formattedTotalUndelegating,
			totalUndelegatingInFiat,
			formattedTotalUndelegatingInFiat
		}
	}, [stackingList, undelegatingData, csprMarketInfo]);
}