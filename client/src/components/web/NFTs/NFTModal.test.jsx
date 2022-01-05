import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { NFTModal } from './NFTModal';

afterEach(cleanup);

test('Show NFT details modal', () => {
	const nftDetails = {
		image: 'image/ntf.png',
		nftName: 'CDAS NFT',
		metadata: [
			{ key: 'image', value: 'image/ntf.png' },
			{ key: 'attribute', value: 'Test Attribute' },
		],
	};
	const { getByText, getByAltText } = render(<NFTModal nftDetails={nftDetails} show />);
	expect(getByAltText('nft-detail').src.includes('image/ntf.png')).toBe(true);
	expect(getByText(/CDAS NFT/i).textContent).toBe('CDAS NFT');
	expect(getByText(/Test Attribute/i).textContent).toBe('Test Attribute');
});

test('Display name as NFT if missing name', () => {
	const nftDetails = {
		image: 'image/ntf.png',
		metadata: [{ key: 'attribute', value: 'Test Attribute' }],
	};
	const { getByText } = render(<NFTModal nftDetails={nftDetails} show />);
	expect(getByText(/NFT/i).textContent).toBe('NFT');
});
