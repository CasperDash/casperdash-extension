import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@cd/web-extension/Common/Grid';
import { useTokenInfo } from '@cd/hooks/useTokensInfo';
import useBalanceVisible from '@cd/hooks/useBalanceVisible';
import { toFormattedCurrency, toFormattedNumber } from '@cd/helpers/format';

const tokensGridMetadata = {
	left: [
		{ key: 'symbol', type: 'primary' },
		{
			key: 'balance.displayValue',
			type: 'secondary',
		},
	],
	right: [
		{ key: 'totalPrice', type: 'primary' },
		{ key: 'price', type: 'secondary', format: 'currency', formatOptions: { minimumFractionDigits: 4 } },
	],
};

const ListTokens = () => {
	const navigate = useNavigate();
	const { allTokenInfo, isFetching } = useTokenInfo();
	const { isBalanceVisible } = useBalanceVisible();

	const onSelectToken = (token) => {
		navigate('/token', { state: { token, name: token.symbol } });
	};

	const normalizedTokens = useMemo(() => {
		return allTokenInfo.map((token) => {
			const { totalPrice, balance } = token;

			return {
				...token,
				totalPrice: isBalanceVisible ? toFormattedCurrency(totalPrice): '*****',
				balance: {
					...balance,
					displayValue: isBalanceVisible ? toFormattedNumber(balance.displayValue) : '*****',
				}
			};
		});
	}, [isBalanceVisible, allTokenInfo]);

	return (
		<Grid
			data={normalizedTokens}
			metadata={tokensGridMetadata}
			onRowClick={onSelectToken}
			isLoading={isFetching}
		/>
	)
}

export default ListTokens;