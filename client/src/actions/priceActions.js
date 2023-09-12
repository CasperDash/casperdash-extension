import { PRICE } from '../store/actionTypes';

/**
 * @returns {object}
 */
export const fetchPriceHistory = () => ({
	type: PRICE.FETCH_PRICE_HISTORY,
	request: {
		url: '/price/history',
	},
});

export const fetchCSPRMarketInfo = () => ({
	type: PRICE.FETCH_CSPR_MARKET_INFO,
	request: {
		url: 'price/latest',
	},
});
