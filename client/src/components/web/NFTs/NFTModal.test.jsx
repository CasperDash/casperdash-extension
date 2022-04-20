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
			tokenId: '123',
			type: 'Transfer',
			status: 'pending',
		},
	];
	const nftDetails = {
		image: 'image/ntf.png',
		nftName: 'CDAS NFT',
		metadata: [
			{ key: 'image', value: 'image/ntf.png' },
			{ key: 'attribute', value: 'Test Attribute' },
		],
		tokenId: '123',
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
		image: 'image/ntf-transfer.png',
		nftName: 'TRANSFER NFT',
		metadata: [{ key: 'image', value: 'image/ntf-transfer.png' }],
		tokenId: '1234',
	};

	const { getByText } = render(<NFTModal show enableTransferForm={true} nftDetails={nftDetails} />);
	expect(getByText(/Recipient/i).textContent).toBe('Recipient');
	expect(getByText(/Transfer/i).textContent).toBe('Transfer');
});

test('Display transfer form in transferring state', () => {
	const nftDetails = {
		image: 'image/ntf-transferring.png',
		nftName: 'CDAS NFT TRANSFERRING',
		metadata: [{ key: 'image', value: 'image/ntf-transferring.png' }],
		tokenId: '12345',
	};

	const { getByText } = render(<NFTModal show enableTransferForm={true} nftDetails={nftDetails} />);
	expect(getByText(/Recipient/i).textContent).toBe('Recipient');
	expect(getByText(/Transfer/i).textContent).toBe('Transfer');
});
