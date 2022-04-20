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

test('NFT has pending deploy', () => {
	const nftDeployHistory = [
		{
			tokenId: '123456',
			type: 'Transfer',
			status: 'pending',
		},
	];
	const nftDetails = {
		image: 'image/ntf-123456.png',
		nftName: 'CDAS NFT SAMPLE',
		tokenId: '123456',
	};

	const { getByText } = render(
		<NFTModal show enableTransferForm={true} nftDetails={nftDetails} nftDeployHistory={nftDeployHistory} />,
	);
	expect(getByText(/This NFT is having the pending transfer/i).textContent).toBe(
		'This NFT is having the pending transfer. See more details.',
	);
});

test('Display transfer form', () => {
	const nftDetails = {
		image: 'image/ntf-1.png',
		nftName: 'SPECIAL NFT',
		metadata: [{ key: 'image', value: 'image/ntf-1.png' }],
		tokenId: '1234',
	};

	const { getByText } = render(<NFTModal show enableTransferForm={true} nftDetails={nftDetails} />);
	expect(getByText(/Recipient/i).textContent).toBe('Recipient');
	expect(getByText(/Transfer/i).textContent).toBe('Transfer');
});
