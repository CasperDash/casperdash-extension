import { fetchPriceHistory, fetchCSPRMarketInfo } from './priceActions';

test('fetchPriceHistory', () => {
	expect(fetchPriceHistory()).toEqual({
		type: 'PRICE.FETCH_PRICE_HISTORY',
		request: {
			url: '/price/history',
		},
	});
});

test('fetchCSPRMarketInfo', () => {
	expect(fetchCSPRMarketInfo()).toEqual({
		type: 'PRICE.FETCH_CSPR_MARKET_INFO',
		request: {
			url: 'price/latest',
		},
	});
});
