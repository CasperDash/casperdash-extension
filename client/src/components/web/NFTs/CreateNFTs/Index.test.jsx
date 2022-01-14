/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import * as redux from 'react-redux';
import CreateNFT from './index';

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

jest.mock('../../../Common/Layout/HeadingComponent/Heading', () => {
	return {
		__esModule: true,
		default: () => {
			return <div />;
		},
	};
});

jest.mock('../NFTTab', () => ({ NFTTab: () => <div /> }));

afterEach(cleanup);

test('Should display navigate to NFT page if no public key', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce('');
	const { getByText } = render(<CreateNFT />);
	expect(getByText(/Add new collection/i).textContent).toBe('Add new collection');
});

test('Should display mint NFT tab - without NFT contract', () => {
	spyOnUseSelector.mockReturnValue([]);
	const { getByText } = render(<CreateNFT />);
	expect(getByText(/Your account did not have any collections yet./i).textContent).toBe(
		'Your account did not have any collections yet. Click to deploy.',
	);
	fireEvent.click(getByText('Click to deploy.'));
	expect(getByText(/Collection Name/i).textContent).toBe('Collection Name *');
	expect(getByText(/NFT Symbol/i).textContent).toBe('NFT Symbol *');
});
