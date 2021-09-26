import { PRICE } from '../store/actionTypes';

export const fetchPrizeHistory = () => ({
	type: PRICE.FETCH_PRIZE_HISTORY,
	request: {
		baseURL: 'https://api.coingecko.com/',
		url: 'api/v3/coins/casper-network/market_chart?vs_currency=usd&days=30&interval=hourly',
	},
});
