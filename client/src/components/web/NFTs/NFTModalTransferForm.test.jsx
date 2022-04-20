import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { NFTModal } from './NFTModal';

jest.mock('../../hooks/useConfirmDeploy', () => {
	return {
		__esModule: true,
		useConfirmDeploy: jest.fn(() => {
			return {
				isDeploying: true,
			};
		}),
	};
});
afterEach(cleanup);

test('Display transfer form in transferring state', () => {
	const nftDetails = {
		image: 'image/ntf-transferring-state-test.png',
		nftName: 'TRANSFER STATE NFT',
		tokenId: '123456',
	};

	const { getByText } = render(<NFTModal show enableTransferForm={true} nftDetails={nftDetails} />);
	expect(getByText(/Recipient/i).textContent).toBe('Recipient');
	expect(getByText(/Transfer/i).textContent).toBe('Transferring...');
});
