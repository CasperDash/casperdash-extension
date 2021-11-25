import { getQuerySelector } from '@redux-requests/core';
import { priceSelector, getPriceHistory, getCurrentPrice } from './price';

jest.mock('@redux-requests/core', () => {
	return {
		getQuerySelector: jest.fn().mockReturnValue(() => ({ data: { prices: [[101010, 11]] } })),
	};
});

test('priceSelector should call getQuerySelector ', () => {
	priceSelector;
	expect(getQuerySelector).toHaveBeenCalled();
});

test('getPriceHistory should return price data ', () => {
	expect(getPriceHistory()).toEqual([[101010, '11.0000']]);
});

test('getCurrentPrice should return current price', () => {
	expect(getCurrentPrice()).toEqual('11.0000');
});
