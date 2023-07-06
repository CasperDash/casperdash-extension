import { useSelector } from 'react-redux';
import _get from 'lodash-es/get';

import { getValueByFormat } from '@cd/helpers/format';
import { getMassagedUserDetails, userDetailsSelector } from '@cd/selectors/user';
import { CSPRMarketInfoSelector, getLatestMarketInfo } from '@cd/selectors/price';

export const useWallet = () => {
    const { isLoading: isLoadingUser } = useSelector(userDetailsSelector);
    const { isLoading: isLoadingMarketInfo } = useSelector(CSPRMarketInfoSelector);
    const userDetails = useSelector(getMassagedUserDetails);
    const csprMarketInfo = useSelector(getLatestMarketInfo);

    const balance = _get(userDetails, 'balance.displayBalance', 0);
    const formattedBalance = balance ? `${getValueByFormat(balance, { format: 'number' })}` : '0';
    const balanceInFiat = balance * _get(csprMarketInfo, 'price', 0);

    return {
        isLoading: isLoadingUser || isLoadingMarketInfo,
        balance,
        formattedBalance,
        balanceInFiat,
        formattedBalanceInFiat: getValueByFormat(balanceInFiat, { format: 'number' }),
    }
}  