import React from 'react';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import * as redux from 'react-redux';
import { useStakeFromValidators } from '../../hooks/useStakeDeploys';
import Stake from './index';

afterEach(cleanup);
//Set up
jest.mock('../../../actions/stakeActions', () => {
	return {
		__esModule: true,
		fetchValidators: () => {},
	};
});

jest.mock('../Common/Layout/HeadingComponent/Heading', () => {
	return {
		__esModule: true,
		default: () => {
			return <div />;
		},
	};
});

jest.mock('../hooks/useStakeDeploys', () => {
	return {
		__esModule: true,
		useStakeFromValidators: jest.fn(),
	};
});

jest.mock('../../Common/Layout/Stake/Form', () => {
	return {
		__esModule: true,
		default: ({ handleToggle, handleUndelegateToggle }) => {
			return (
				<div>
					<button className="ut_handle_toggler" onClick={handleToggle} />
					<button className="ut_handle_undelegate_toggler" onClick={handleUndelegateToggle} />
				</div>
			);
		},
	};
});

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
			'You do not have any delegations yet. Stake CSPR, earn rewards and help Casper become more secure!',
		)[0].textContent,
	).toBe('You do not have any delegations yet. Stake CSPR, earn rewards and help Casper become more secure!');
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
	const { queryAllByText } = render(<Stake />);
	expect(queryAllByText('0x123')[0].textContent).toBe('0x123');
});

describe('Trigger stake form', () => {
	test('Can show stake form', async () => {
		spyOnUseSelector
			.mockReturnValue([])
			.mockReturnValueOnce({})
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
		const { container } = render(<Stake />);

		await act(async () => {
			fireEvent.click(container.querySelector('.cd_send_currency_btn'));
		});

		expect(container.querySelector('.toggle_form')).not.toBeNull();
	});

	test('Can trigger undelegate', async () => {
		spyOnUseSelector
			.mockReturnValue([
				{
					validator: '0x111',
				},
				{
					validator: '0x112',
				},
			])
			.mockReturnValueOnce('0x124')
			.mockReturnValueOnce([])
			.mockReturnValueOnce([
				{
					validator: '0x126',
				},
			]);
		useStakeFromValidators.mockReturnValue([
			{
				validator: '0x123',
			},
		]);
		const { queryAllByText, container } = render(<Stake />);
		await act(async () => {
			fireEvent.click(container.querySelector('.cd_tbl_action_undelegate'));
		});
		expect(queryAllByText('Confirming transactions ...')[0].textContent).toBe('Confirming transactions ... ');
	});

	test('Can trigger undelegate when do not have validators', async () => {
		spyOnUseSelector
			.mockReturnValue([
				{
					validator: '0x111',
				},
				{
					validator: '0x112',
				},
			])
			.mockReturnValueOnce('0x124')
			.mockReturnValueOnce([])
			.mockReturnValueOnce([]);
		useStakeFromValidators.mockReturnValue([
			{
				validator: '0x123',
			},
		]);
		const { queryAllByText, container } = render(<Stake />);
		await act(async () => {
			fireEvent.click(container.querySelector('.cd_tbl_action_undelegate'));
		});
		expect(queryAllByText('Confirming transactions ...')[0].textContent).toBe('Confirming transactions ... ');
	});

	test('Can trigger toggle', async () => {
		spyOnUseSelector
			.mockReturnValue([
				{
					validator: '0x125',
				},
			])
			.mockReturnValueOnce('0x124')
			.mockReturnValueOnce([])
			.mockReturnValueOnce([]);
		useStakeFromValidators.mockReturnValue([
			{
				validator: '0x123',
			},
		]);
		const { container } = render(<Stake />);
		await act(async () => {
			fireEvent.click(container.querySelector('.ut_handle_toggler'));
		});

		expect(container.querySelector('.toggle_form')).not.toBeNull();
	});

	test('Can trigger undelegate toggle', async () => {
		spyOnUseSelector
			.mockReturnValue([
				{
					validator: '0x125',
				},
			])
			.mockReturnValueOnce(['0x124'])
			.mockReturnValueOnce([])
			.mockReturnValueOnce([]);
		useStakeFromValidators.mockReturnValue([
			{
				validator: '0x123',
			},
		]);
		const { container } = render(<Stake />);
		await act(async () => {
			fireEvent.click(container.querySelector('.ut_handle_undelegate_toggler'));
		});

		expect(container.querySelector('.toggle_form')).not.toBeNull();
	});
});
