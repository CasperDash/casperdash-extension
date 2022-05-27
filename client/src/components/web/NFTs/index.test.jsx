/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import * as redux from 'react-redux';
import NFTs from './index';

let spyOnUseSelector;
let spyOnUseDispatch;
let mockDispatch;
beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSelector = jest.spyOn(redux, 'useSelector');
	// Mock useDispatch hook
	spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
	// Mock dispatch function returned from useDispatch
	mockDispatch = jest.fn();
	spyOnUseDispatch.mockReturnValue(mockDispatch);
});

jest.mock('../../../actions/NFTActions', () => {
	//Mock the default export and named export 'foo'
	return {
		__esModule: true,
		getNFTAddressesFromLocalStorage: () => {},
		getNFTDeploysFromLocalStorage: () => {},
		addCustomNFTAddressToLocalStorage: () => {},
		fetchNFTContractInfo: () => {},
		fetchNFTInfo: () => ({ error: { message: 'error message' } }),
	};
});

jest.mock('react-router-dom', () => {
	return {
		Link: () => <div />,
	};
});

jest.mock('../../Common/Layout/HeadingComponent/Heading', () => {
	return {
		__esModule: true,
		default: () => {
			return <div />;
		},
	};
});

afterEach(cleanup);

test('Show no NFT message', () => {
	spyOnUseSelector.mockReturnValue([]);
	const { getByText } = render(<NFTs />);
	expect(getByText(/You do not have any NFT collectables yet/i).textContent).toBe(
		'You do not have any NFT collectables yet.',
	);
});
test('NFTs array is null', () => {
	spyOnUseSelector.mockReturnValue(null);
	const { getByText } = render(<NFTs />);
	expect(getByText(/You do not have any NFT collectables yet/i).textContent).toBe(
		'You do not have any NFT collectables yet.',
	);
});

test('Have NFT', () => {
	spyOnUseSelector.mockReturnValue([
		{ tokenId: 1, nftName: 'Token Name', metadata: [{ key: 'name', value: 'Token Name' }] },
	]);
	const { getByText } = render(<NFTs />);

	expect(getByText(/Token Name/i).textContent).toBe('Token Name');
});

test('Click on NFT to display details then close', () => {
	spyOnUseSelector.mockReturnValue([
		{
			tokenId: 1,

			nftName: 'Token Name',
			image: 'image/nft.png',
			metadata: [{ key: 'details', value: 'Token Details' }],
		},
	]);
	const { getByText, getByAltText } = render(<NFTs />);
	expect(getByAltText('nft-image').src.includes('image/nft.png')).toBe(true);
	fireEvent.click(getByText('Token Name'));
	expect(getByText(/Token Details/i).textContent).toBe('Token Details');
});

test('Missing TokenId', () => {
	spyOnUseSelector.mockReturnValue([
		{
			metadata: [
				{ key: 'name', value: 'Token Name' },
				{ key: 'details', value: 'Token Details' },
			],
		},
	]);
	const { queryByText } = render(<NFTs />);
	expect(queryByText('Token Name')).toBe(null);
});

test('Missing token name', () => {
	spyOnUseSelector.mockReturnValue([
		{
			tokenId: 1,
			metadata: [{ key: 'image', value: 'nft-empty.png' }],
		},
	]);
	const { queryByText } = render(<NFTs />);
	expect(queryByText('Token Name')).toBe(null);
});
