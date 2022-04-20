import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { NFTModal } from './NFTModal';

jest.mock('../../hooks/useConfirmDeploy', () => {
	return {
		__esModule: true,
		useConfirmDeploy: jest.fn(() => {
			return {
				executeDeploy: jest.fn(() => {
					return {
						deployHash: '0x123',
						signedDeploy: {
							deploy: {
								header: {
									timestamp: 1234,
								},
							},
						},
					};
				}),
				isDeploying: true,
			};
		}),
	};
});
afterEach(cleanup);

test('Display transfer form in transferring state', () => {
	const nftDetails = {
		image: 'image/ntf.png',
		nftName: 'CDAS NFT',
		metadata: [
			{ key: 'image', value: 'image/ntf.png' },
			{ key: 'attribute', value: 'Test Attribute' },
		],
		tokenId: '123',
	};

	const { getByText } = render(<NFTModal show enableTransferForm={true} nftDetails={nftDetails} />);
	expect(getByText(/Recipient/i).textContent).toBe('Recipient');
	expect(getByText(/Transfer/i).textContent).toBe('Transferring...');
});
