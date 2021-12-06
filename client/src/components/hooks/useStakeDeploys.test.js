import { cleanup } from '@testing-library/react';
import * as redux from 'react-redux';
import React from 'react';
import { useStakeFromValidators } from './useStakeDeploys';

jest.mock('../../actions/stakeActions', () => {
	return {
		__esModule: true,
		getStakeFromLocalStorage: jest.fn(),
		updateStakeDeployStatus: jest.fn(),
	};
});

jest.mock('./useAutoRefreshEffect', () => {
	return {
		__esModule: true,
		useAutoRefreshEffect: jest.fn(),
	};
});

jest.mock('../../actions/deployActions', () => {
	return {
		__esModule: true,
		getTransferDeploysStatus: jest.fn(),
	};
});
afterEach(cleanup);
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

	jest.spyOn(React, 'useEffect').mockImplementationOnce(() => {});
});

test('Have a new pending delegation', () => {
	spyOnUseSelector.mockReturnValue([{ validator: '0x123', amount: 1000 }]).mockReturnValueOnce([
		{
			public_key: '0x345',
			bidInfo: {
				bid: {
					delegators: [
						{
							public_key: '0x00',
							staked_amount: 1000000000,
						},
					],
				},
			},
		},
	]);
	const stakedValidators = useStakeFromValidators('0x00');
	expect(stakedValidators.length).toBe(2);
	expect(stakedValidators[0].stakedAmount).toBe(1);
	expect(stakedValidators[1].pendingAmount).toBe(1000);
});

test('Have an existing pending delegation', () => {
	spyOnUseSelector.mockReturnValue([{ validator: '0x345', amount: 1000 }]).mockReturnValueOnce([
		{
			public_key: '0x345',
			bidInfo: {
				bid: {
					delegators: [
						{
							public_key: '0x00',
							staked_amount: 1000000000,
						},
					],
				},
			},
		},
	]);
	const stakedValidators = useStakeFromValidators('0x00');
	expect(stakedValidators.length).toBe(1);
	expect(stakedValidators[0].stakedAmount).toBe(1);
	expect(stakedValidators[0].pendingAmount).toBe(1000);
});

test('Have an existing pending undelegation', () => {
	spyOnUseSelector
		.mockReturnValue([{ validator: '0x345', amount: 1000, entryPoint: 'undelegate' }])
		.mockReturnValueOnce([
			{
				public_key: '0x345',
				bidInfo: {
					bid: {
						delegators: [
							{
								public_key: '0x00',
								staked_amount: 1000000000000,
							},
						],
					},
				},
			},
		]);
	const stakedValidators = useStakeFromValidators('0x00');
	expect(stakedValidators.length).toBe(1);
	expect(stakedValidators[0].stakedAmount).toBe(1000);
	expect(stakedValidators[0].pendingAmount).toBe(-1000);
});

test('Do have any delegations', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce([
		{
			public_key: '0x345',
			bidInfo: {
				bid: {
					delegators: [
						{
							public_key: '0x01',
							staked_amount: 1000000000,
						},
					],
				},
			},
		},
	]);
	const stakedValidators = useStakeFromValidators('0x00');
	expect(stakedValidators.length).toBe(0);
});

test('Do have any delegations', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce([]);
	const stakedValidators = useStakeFromValidators('0x00');
	expect(stakedValidators.length).toBe(0);
});

test('Validators do not have bid info', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce([
		{
			public_key: '0x345',
		},
	]);
	const stakedValidators = useStakeFromValidators('0x00');
	expect(stakedValidators.length).toBe(0);
});
