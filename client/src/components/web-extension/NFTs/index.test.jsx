import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import * as router from 'react-router-dom';
import NFTs from './';

afterEach(cleanup);
let spyOnUseSearchParams


beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSearchParams = jest.spyOn(router, 'useSearchParams');
});

afterEach(cleanup);

test('Should show list NFT', async () => {
	spyOnUseSearchParams.mockReturnValue([{ get: () => undefined }]);
	useSelector
		.mockReturnValue({})
		.mockReturnValueOnce('test')
		.mockReturnValue([{ tokenId: 'testnftid', nftName: 'testnftname', nftContractName: 'testcontractname' }]);
	const { getByText, container } = render(<NFTs />);
	const collectionSort = getByText(/Collection/i);
	expect(collectionSort.textContent).toBe('Collection');
	expect(getByText('Name').textContent).toBe('Name');

	const nftName = getByText('testnftname');
	expect(getByText(/1 NFTs/i).textContent).toBe('1 NFTs');
	expect(nftName.textContent).toBe('testnftname');
	expect(getByText(/testcontractname/i).textContent).toBe('testcontractname');
	fireEvent.click(nftName);
	expect(router.useNavigate()).toHaveBeenCalled();
	await fireEvent.click(collectionSort);
	expect(Boolean(container.querySelector('arrow-down'))).toBe(false);
});

test('Should show no nft message', async () => {
	spyOnUseSearchParams.mockReturnValue([{ get: () => undefined }]);
	useSelector.mockReturnValue({});
	const { getByText } = render(<NFTs />);
	expect(getByText(/You do not have any NFT collectables yet/i).textContent).toBe(
		'You do not have any NFT collectables yet',
	);
});
