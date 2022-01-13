/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { NFTDetails } from './';

afterEach(cleanup);

test('Should display empty nft attribute  ', async () => {
	useLocation.mockReturnValue({
		state: {
			nftDetails: {
				image: 'image',
				nftName: 'name1',
				nftContractName: 'CasperDash',
				metadata: [{ name: 'Year', value: '2022', key: 'year' }],
				contractAddress: '12312312313',
				totalSupply: 100,
			},
		},
	});
	const { getByText } = render(<NFTDetails />);
	expect(getByText('Collection').textContent).toBe('Collection');
	expect(getByText('Attributes').textContent).toBe('Attributes');
	expect(getByText('CasperDash').textContent).toBe('CasperDash');
	expect(getByText('year').textContent).toBe('year');
	expect(getByText('2022').textContent).toBe('2022');
	expect(getByText('123123').textContent).toBe('123123');
	expect(getByText('Total supply: 100').textContent).toBe('Total supply: 100');
});

test('Should display NFT details ', async () => {
	useLocation.mockReturnValue({ state: {} });
	const { getByText } = render(<NFTDetails />);
	expect(getByText('Collection').textContent).toBe('Collection');
	expect(getByText('Attributes').textContent).toBe('Attributes');
});
