import { getQuerySelector } from '@redux-requests/core';
import { createSelector } from 'reselect';
import { PRICE } from '../store/actionTypes';

export const priceSelector = getQuerySelector({ type: PRICE.FETCH_PRIZE_HISTORY });

export const getPriceHistory = createSelector(priceSelector, ({ data }) => {
	if (!data) {
		return [];
	}
	return data.prices.map((price) => [price[0], parseFloat(price[1]).toFixed(4)]);
});

export const getCurrentPrice = createSelector(getPriceHistory, (priceHistory) => {
	return priceHistory.length ? priceHistory[priceHistory.length - 1][1] : 0;
});
