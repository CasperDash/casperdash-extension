import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { PRICE } from '../store/actionTypes';

export const priceSelector = getQuerySelector({ type: PRICE.FETCH_PRICE_HISTORY });

export const CSPRMarketInfoSelector = getQuerySelector({ type: PRICE.FETCH_CSPR_MARKET_INFO });

export const getPriceHistory = createSelector(priceSelector, ({ data }) => {
	return data ? data.map((price) => [price[0], parseFloat(price[1]).toFixed(4)]) : [];
});

export const getCurrentPrice = createSelector(CSPRMarketInfoSelector, ({ data }) => {
	return data?.price || 0;
});

export const getLatestMarketInfo = createSelector(CSPRMarketInfoSelector, ({ data }) => {
	return data || {};
});

export const getCurrentAPY = createSelector(CSPRMarketInfoSelector, ({ data }) => {
	return data?.apy || 0;
});
