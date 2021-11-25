import { fetchPriceHistory } from './priceActions';

test('fetchPriceHistory', () => {
	expect(fetchPriceHistory()).toEqual({
		type: 'PRICE.FETCH_PRICE_HISTORY',
		request: {
			baseURL: 'https://api.coingecko.com/',
			url: 'api/v3/coins/casper-network/market_chart?vs_currency=usd&days=30&interval=hourly',
		},
	});
});
