import { fetchPriceHistory, fetchCSPRMarketInfo } from './priceActions';

test('fetchPriceHistory', () => {
	expect(fetchPriceHistory()).toEqual({
		type: 'PRICE.FETCH_PRICE_HISTORY',
		request: {
			baseURL: 'https://api.coingecko.com/',
			url: 'api/v3/coins/casper-network/market_chart?vs_currency=usd&days=30&interval=hourly',
		},
	});
});

test('fetchCSPRMarketInfo', () => {
	expect(fetchCSPRMarketInfo()).toEqual({
		type: 'PRICE.FETCH_CSPR_MARKET_INFO',
		request: {
			baseURL: 'https://api.coingecko.com/',
			url: 'api/v3/coins/markets?vs_currency=usd&ids=casper-network',
		},
	});
});
