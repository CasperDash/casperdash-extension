import { useSelector } from 'react-redux';
import _get from 'lodash-es/get';

import { getValueByFormat } from '@cd/helpers/format';
import { useStakeFromValidators } from './useStakeDeploys';
import { getLatestMarketInfo } from '@cd/selectors/price';
import { getPendingStakes, getUndelegatingStakes } from '@cd/selectors/stake';

export const useStakeInfo = (publicKey) => {
    const stackingList = useStakeFromValidators(publicKey);
    const csprMarketInfo = useSelector(getLatestMarketInfo);
    const undelegatingStakes = useSelector(getUndelegatingStakes());

    const totalStaked = stackingList ? stackingList.reduce((acc, cur) => acc + cur.stakedAmount, 0): 0;
    const totalStakedInFiat = totalStaked * _get(csprMarketInfo, 'price', 0);
    const formattedTotalStakedInFiat = getValueByFormat(totalStakedInFiat, { format: 'number' });
    const formattedTotalStaked = getValueByFormat(totalStaked, { format: 'number' });

    console.log('undelegatingStakes: ', undelegatingStakes);

    const totalUndelegating = undelegatingStakes.reduce((acc, cur) => acc + cur.amount, 0);
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
}