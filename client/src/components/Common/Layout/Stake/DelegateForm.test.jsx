import React from 'react';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import * as redux from 'react-redux';
import * as toastify from 'react-toastify';
import { getStakeDeploy } from '../../../../services/stakeServices';
import DelegateForm from './DelegateForm';

jest.mock('react-toastify');
jest.mock('../../../../actions/deployActions', () => {
	return {
		__esModule: true,
		putDeploy: jest.fn(),
		pushTransferToLocalStorage: () => {},
	};
});
jest.mock('../../../../actions/stakeActions', () => {
	return {
		pushStakeToLocalStorage: () => {},
	};
});

jest.mock('../../../../services/stakeServices', () => {
	return {
		__esModule: true,
		getStakeDeploy: jest.fn(),
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
});

describe('DelegateForm displays normally', () => {
	test('Should show delegate form with validators', () => {
		const validators = [
			{
				public_key: '0x123',
				bidInfo: {
					bid: {
						delegate_rate: 1,
					},
				},
			},
		];
		spyOnUseSelector.mockReturnValue({
			deployError: '',
			isDeploying: false,
		});
		const { getByText } = render(<DelegateForm balance="1000" fee="50" validators={validators} />);
		expect(getByText('Stake').textContent).toBe('Stake');
		expect(getByText('1000').textContent).toBe('1000');
	});

	test('Should set the quick staked amount by a quarter of balance', async () => {
		spyOnUseSelector.mockReturnValue([]);

		const { getByText, container } = render(<DelegateForm balance="1000" fromAddress="0x123" tokenSymbol="CSPR" />);

		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.click(getByText('1/4'));
		});
		expect(stakeAmountInput.value).toBe('245');
	});

	test('Should set the quick staked amount by a half of balance', async () => {
		spyOnUseSelector.mockReturnValue([]);

		const { getByText, container } = render(<DelegateForm balance="1000" fromAddress="0x123" tokenSymbol="CSPR" />);

		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.click(getByText('Half'));
		});
		expect(stakeAmountInput.value).toBe('495');
	});

	test('Should set the quick staked amount by all in', async () => {
		spyOnUseSelector.mockReturnValue([]);

		const { getByText, container } = render(<DelegateForm balance="1000" fromAddress="0x123" tokenSymbol="CSPR" />);

		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.click(getByText('All'));
		});
		expect(stakeAmountInput.value).toBe('995');
	});
});

describe('Should show error if not valid form when click send', () => {
	const setup = ({ balance = 1000, tokenSymbol = 'CSPR' }) => {
		spyOnUseSelector.mockReturnValue([]);

		const { getByText, container, queryAllByText } = render(
			<DelegateForm balance={balance} fromAddress="0x123" tokenSymbol={tokenSymbol} />,
		);
		const stakeBtn = queryAllByText('Stake')[0];

		return { getByText, container, queryAllByText, stakeBtn };
	};

	test('Insufficient balance', async () => {
		const { getByText, stakeBtn, container } = setup({
			balance: 1,
		});
		await act(async () => {
			fireEvent.click(stakeBtn);
		});
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: '1' },
			});
		});
		expect(getByText('Insufficient balance. System requires 2.5 CSPR minimum balance.').textContent).toBe(
			'Insufficient balance. System requires 2.5 CSPR minimum balance.',
		);
	});

	test('Staked amount is less then zero', async () => {
		const { getByText, stakeBtn, container } = setup({
			balance: 5,
		});
		await act(async () => {
			fireEvent.click(stakeBtn);
		});
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: '-1' },
			});
		});
		expect(getByText('Amount must be more than 0 CSPR.').textContent).toBe('Amount must be more than 0 CSPR.');
	});

	test('Not enough balance', async () => {
		const { getByText, stakeBtn, container } = setup({
			balance: 5,
		});
		await act(async () => {
			fireEvent.click(stakeBtn);
		});
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: '9' },
			});
		});
		expect(getByText('Not enough balance.').textContent).toBe('Not enough balance.');
	});
});

describe('Stake with errors', () => {
	test('Should show error if can not sign the transaction', async () => {
		spyOnUseSelector.mockReturnValue([]);
		getStakeDeploy.mockRejectedValue(new Error('Signed error'));
		const validators = [
			{
				public_key: '0x123',
				bidInfo: {
					bid: {
						delegate_rate: 1,
					},
				},
			},
		];
		const { getByText, container } = render(
			<DelegateForm
				fromAddress="0x000"
				defaultValidator="0x123"
				balance={999999}
				fee={1}
				validators={validators}
				tokenSymbol="CSPR"
			/>,
		);

		const stakeBtn = getByText('Stake');
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: 9 },
			});
		});

		await act(async () => {
			fireEvent.click(stakeBtn);
		});

		await act(async () => {
			fireEvent.click(getByText('Confirm'));
		});

		expect(toastify.toast).toHaveBeenCalled();
	});

	test('Should show error if can not put the deploy', async () => {
		spyOnUseSelector.mockReturnValue([]);
		getStakeDeploy.mockReturnValue({});
		mockDispatch.mockRejectedValue(new Error('Failed to put deploy'));
		const validators = [
			{
				public_key: '0x123',
				bidInfo: {
					bid: {
						delegate_rate: 1,
					},
				},
			},
		];
		const { getByText, container } = render(
			<DelegateForm
				fromAddress="0x000"
				defaultValidator="0x123"
				balance={999999}
				fee={1}
				validators={validators}
				tokenSymbol="CSPR"
				csprPrice={0.001}
			/>,
		);

		const stakeBtn = getByText('Stake');
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: 9 },
			});
		});

		await act(async () => {
			fireEvent.click(stakeBtn);
		});

		await act(async () => {
			fireEvent.click(getByText('Confirm'));
		});

		expect(toastify.toast).toHaveBeenCalled();
	});
});

describe('Success to stake the valid amount', () => {
	test('Should show deploy hash', async () => {
		spyOnUseSelector.mockReturnValue([]);
		getStakeDeploy.mockReturnValue({
			deploy: {
				header: {
					timestamp: '00001',
				},
			},
		});
		mockDispatch.mockReturnValue({
			data: {
				deployHash: '0x113',
			},
		});
		const validators = [
			{
				public_key: '0x123',
				bidInfo: {
					bid: {
						delegate_rate: 1,
					},
				},
			},
		];
		const { getByText, container, queryAllByText } = render(
			<DelegateForm
				fromAddress="0x000"
				defaultValidator="0x123"
				balance={999999}
				fee={1}
				validators={validators}
				tokenSymbol="CSPR"
				csprPrice={0.001}
			/>,
		);

		const stakeBtn = getByText('Stake');
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: 9 },
			});
		});

		await act(async () => {
			fireEvent.click(stakeBtn);
		});

		await act(async () => {
			fireEvent.click(getByText('Confirm'));
		});

		expect(queryAllByText('0x113')[0].textContent).toBe('0x113');
	});
});
