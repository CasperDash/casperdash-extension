/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { TokenList } from './index';

afterEach(cleanup);

test('Should display token info', () => {
	const { getByText } = render(
		<TokenList
			tokensInfo={[{ symbol: 'CDAS', address: 'cdasaddress', balance: { displayValue: '1000' }, price: 1 }]}
		/>,
	);
	expect(getByText('CDAS').textContent).toBe('CDAS');
	expect(getByText('1,000').textContent).toBe('1,000');
	expect(getByText('$1,000.00').textContent).toBe('$1,000.00');
});

test('Should display set selected token info when click ', () => {
	const { getByText } = render(
		<TokenList
			tokensInfo={[
				{ symbol: 'CDAS', address: 'cdasaddress', balance: { displayValue: '1000' }, price: 1 },
				{ symbol: 'CBTC', address: 'cbtcaddress', balance: { displayValue: '500' }, price: 1 },
			]}
			onTokenClick={() => {}}
		/>,
	);

	const CBTCBtn = getByText('CBTC');
	fireEvent.click(CBTCBtn);
	expect(getByText('CBTC').textContent).toBe('CBTC');
});

test('Should set active if is selected token ', () => {
	const { container } = render(
		<TokenList
			tokensInfo={[{ symbol: 'CBTC', address: 'cbtcaddress', balance: { displayValue: '500' }, price: 1 }]}
			onTokenClick={() => {}}
			selectedToken={{ address: 'cbtcaddress' }}
		/>,
	);

	expect(container.querySelector('.cd_add_token_inner_content').className.includes('active')).toBe(true);
});

test('Should set $ balance to  -- if no balance ', () => {
	const { getByText } = render(
		<TokenList
			tokensInfo={[{ symbol: 'CBTC', address: 'cbtcaddress', price: 1 }]}
			onTokenClick={() => {}}
			selectedToken={{ address: 'cbtcaddress' }}
		/>,
	);

	expect(getByText('$--').textContent).toBe('$--');
});
