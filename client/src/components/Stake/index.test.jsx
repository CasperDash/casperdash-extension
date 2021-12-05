import { render, cleanup } from '@testing-library/react';
import * as redux from 'react-redux';

import Stake from './index';
afterEach(cleanup);
//Set up
jest.mock('../../actions/stakeActions', () => {
	return {
		__esModule: true,
		fetchValidators: () => {},
	};
});

jest.mock('../hooks/useStakeDeploys', () => {
	return {
		__esModule: true,
		useStakeFromValidators: jest.fn(),
	};
});

jest.mock('../Common/Layout/Stake/Form', () => {
	return {
		__esModule: true,
		default: () => {
			return <form />;
		},
	};
});

import { useStakeFromValidators } from '../hooks/useStakeDeploys';

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

test('Signer is locked', () => {
	spyOnUseSelector.mockReturnValue({}).mockReturnValueOnce(null).mockReturnValueOnce([]);
	const { queryAllByText } = render(<Stake />);
	expect(queryAllByText('Please unlock your Casper Signer to see your delegations')[0].textContent).toBe(
		'Please unlock your Casper Signer to see your delegations',
	);
});

test('Do not have any delegations', () => {
	spyOnUseSelector
		.mockReturnValue(false)
		.mockReturnValueOnce('0x123')
		.mockReturnValueOnce([])
		.mockReturnValueOnce([]);
	const { queryAllByText } = render(<Stake />);
	expect(
		queryAllByText(
			'You do not have any delegations yet. Stake CSPR, earn rewards and help Capser become more secure!',
		)[0].textContent,
	).toBe('You do not have any delegations yet. Stake CSPR, earn rewards and help Capser become more secure!');
});

test('Have delegations', () => {
	spyOnUseSelector
		.mockReturnValue(false)
		.mockReturnValueOnce('0x123')
		.mockReturnValueOnce([])
		.mockReturnValueOnce([
			{
				validator: '0x123',
			},
		]);
	useStakeFromValidators.mockReturnValue([
		{
			validator: '0x123',
		},
	]);
	const { queryAllByText, debug } = render(<Stake />);
	expect(queryAllByText('0x123')[0].textContent).toBe('0x123 ');
});
