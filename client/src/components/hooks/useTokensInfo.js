import { useDispatch, useSelector } from 'react-redux';
import { fetchTokensInfoWithBalance } from '../../actions/tokensActions';
import { getTokensAddressList, isFetchingTokensInfo } from '../../selectors/tokens';
import { getPublicKey, getAllTokenInfo, getTokenInfoByAddress } from '../../selectors/user';
import { useAutoRefreshEffect } from './useAutoRefreshEffect';

// Note: only use this if need to refetch the token data
export const useTokenInfo = (token) => {
	const dispatch = useDispatch();

	// Selector
	const tokensAddressList = useSelector(getTokensAddressList);
	const publicKey = useSelector(getPublicKey);
	const allTokenInfo = useSelector(getAllTokenInfo);
	const tokenInfoByAddress = useSelector(getTokenInfoByAddress(token));
	const isFetching = useSelector(isFetchingTokensInfo);

	// Effect
	useAutoRefreshEffect(() => {
		if (!isFetching && publicKey) {
			dispatch(fetchTokensInfoWithBalance(tokensAddressList, publicKey));
		}
	}, [publicKey, JSON.stringify(tokensAddressList)]);

	return { allTokenInfo, tokenInfoByAddress, isFetching };
};
