/* eslint-disable complexity */
import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { TOKENS } from '../store/actionTypes';

export const tokensSelector = getQuerySelector({ type: TOKENS.FETCH_TOKENS_INFO_WITH_BALANCE });

export const isFetchingTokensInfo = createSelector(tokensSelector, (token) => {
	return token.loading;
});

export const getMassagedTokenData = createSelector(tokensSelector, ({ data }) => {
	if (!Array.isArray(data)) {
		return [];
	}

	return data.map((datum) => {
		try {
			const decimals = (datum.decimals && datum.decimals.hex) || 0;

			return {
				...datum,
				balance:
					typeof datum.balance === 'object'
						? {
								...datum.balance,
								displayValue:
									datum.balance && datum.balance.hex
										? parseFloat(datum.balance.hex / 10 ** decimals).toFixed(2)
										: 0,
						  }
						: { displayValue: datum.balance || 0 },
				total_supply: {
					...datum.total_supply,
					displayValue:
						datum.total_supply && datum.total_supply.hex
							? parseInt(datum.total_supply.hex / 10 ** decimals)
							: 0,
				},
				decimals: {
					...datum.decimals,
					displayValue: datum.decimals && datum.decimals.hex ? parseInt(datum.decimals.hex) : 0,
				},
			};
		} catch (error) {
			return {};
		}
	});
});

export const getTokensAddressList = ({ tokens }) => {
	const tokensAddress = (tokens && tokens.address) || [];
	return [...new Set([...tokensAddress])];
};
