import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { NFTModal } from './NFTModal';

afterEach(cleanup);

test('Show NFT details modal', () => {
	const metadata = [
		{ key: 'name', value: 'CDAS NFT' },
		{ key: 'image', value: 'image/ntf.png' },
		{ key: 'attribute', value: 'Test Attribute' },
	];
	const { getByText, getByAltText } = render(<NFTModal metadata={metadata} show />);
	expect(getByAltText('nft-detail').src.includes('image/ntf.png')).toBe(true);
	expect(getByText(/CDAS NFT/i).textContent).toBe('CDAS NFT');
	expect(getByText(/Test Attribute/i).textContent).toBe('Test Attribute');
});

test('Display name as NFT if missing name', () => {
	const metadata = [
		{ key: 'image', value: 'image/ntf.png' },
		{ key: 'attribute', value: 'Test Attribute' },
	];
	const { getByText } = render(<NFTModal metadata={metadata} show />);
	expect(getByText(/NFT/i).textContent).toBe('NFT');
});

test('Display default image if missing image', () => {
	const metadata = [
		{ key: 'name', value: 'CDAS NFT' },
		{ key: 'attribute', value: 'Test Attribute' },
	];
	const { getByAltText } = render(<NFTModal metadata={metadata} show />);
	expect(getByAltText('nft-detail').src.includes('nft-empty.png')).toBe(true);
});

test('Trigger handleClose when closing modal', () => {
	const metadata = [
		{ key: 'name', value: 'CDAS NFT' },
		{ key: 'attribute', value: 'Test Attribute' },
	];
	const { getByAltText } = render(<NFTModal metadata={metadata} show handleClose={() => {}} />);
	expect(getByAltText('nft-detail').src.includes('nft-empty.png')).toBe(true);
});
