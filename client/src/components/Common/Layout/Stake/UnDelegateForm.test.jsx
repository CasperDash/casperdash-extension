import React from 'react';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import * as redux from 'react-redux';
import { getSignedStakeDeploy } from '../../../../services/stakeServices';
import UnDelegateForm from './UnDelegateForm';
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
		getSignedStakeDeploy: jest.fn(),
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

describe('UnDelegateForm displays normally', () => {
	test('Should show validator info', () => {
		const stakedValidator = {
			validator: '0x11',
			info: {
				bidInfo: {
					bid: {
						delegation_rate: 2,
						staked_amount: 3000000000,
					},
				},
			},
			tokenSymbol: 'CSPR',
		};

		spyOnUseSelector.mockReturnValue({
			deployError: '',
			isDeploying: false,
		});

		const { getAllByText } = render(<UnDelegateForm stakedValidator={stakedValidator} csprPrice={0.0018} />);
		expect(getAllByText('0x11')[0].textContent).toBe('0x11');
		expect(getAllByText('3')[0].textContent).toBe('3 ');
	});

	test('Should have undelegate button', () => {
		const stakedValidator = {
			validator: '0x11',
			info: {
				bidInfo: {
					bid: {
						delegation_rate: 2,
						staked_amount: 3000000000,
					},
				},
			},
			tokenSymbol: 'CSPR',
		};

		spyOnUseSelector.mockReturnValue({
			deployError: '',
			isDeploying: false,
		});
		const { getAllByText } = render(<UnDelegateForm stakedValidator={stakedValidator} />);
		expect(getAllByText('Undelegate')[0].textContent).toBe('Undelegate');
	});

	test('Should set the quick staked amount by a quarter of balance', async () => {
		spyOnUseSelector.mockReturnValue([]);
		const stakedValidator = {
			validator: '0x11',
			info: {
				bidInfo: {
					bid: {
						delegation_rate: 2,
						staked_amount: 3000000000,
					},
				},
			},
			stakedAmount: 1000,
			tokenSymbol: 'CSPR',
		};
		const { getByText, container } = render(
			<UnDelegateForm balance="1000" stakedValidator={stakedValidator} tokenSymbol="CSPR" />,
		);

		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.click(getByText('1/4'));
		});
		expect(stakeAmountInput.value).toBe('250');
	});

	test('Should set the quick staked amount by a half of balance', async () => {
		spyOnUseSelector.mockReturnValue([]);
		const stakedValidator = {
			validator: '0x11',
			info: {
				bidInfo: {
					bid: {
						delegation_rate: 2,
						staked_amount: 3000000000,
					},
				},
			},
			stakedAmount: 1000,
			tokenSymbol: 'CSPR',
		};
		const { getByText, container } = render(
			<UnDelegateForm balance="1000" stakedValidator={stakedValidator} tokenSymbol="CSPR" />,
		);

		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.click(getByText('Half'));
		});
		expect(stakeAmountInput.value).toBe('500');
	});

	test('Should set the quick staked amount by all in', async () => {
		spyOnUseSelector.mockReturnValue([]);
		const stakedValidator = {
			validator: '0x11',
			info: {
				bidInfo: {
					bid: {
						delegation_rate: 2,
						staked_amount: 3000000000,
					},
				},
			},
			stakedAmount: 1000,
			tokenSymbol: 'CSPR',
		};
		const { getByText, container } = render(
			<UnDelegateForm balance="1000" stakedValidator={stakedValidator} fromAddress="0x123" tokenSymbol="CSPR" />,
		);

		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.click(getByText('All'));
		});
		expect(stakeAmountInput.value).toBe('1000');
	});
});

describe('Should show error if not valid form when click send', () => {
	const setup = ({ balance = 1000, tokenSymbol = 'CSPR' }) => {
		spyOnUseSelector.mockReturnValue([]);
		const stakedValidator = {
			validator: '0x11',
			info: {
				bidInfo: {
					bid: {
						delegation_rate: 2,
						staked_amount: 3000000000,
					},
				},
			},
			stakedAmount: 1000,
			tokenSymbol: 'CSPR',
		};
		const { getByText, container, queryAllByText } = render(
			<UnDelegateForm
				balance={balance}
				stakedValidator={stakedValidator}
				fromAddress="0x123"
				tokenSymbol={tokenSymbol}
			/>,
		);
		const unDelegateBtn = queryAllByText('Undelegate')[0];

		return { getByText, container, queryAllByText, stakeBtn: unDelegateBtn };
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

	test('Not enough staked amount', async () => {
		const { getByText, stakeBtn, container } = setup({
			balance: 500,
		});
		await act(async () => {
			fireEvent.click(stakeBtn);
		});
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: '1200' },
			});
		});
		expect(getByText('Not enough staked amount.').textContent).toBe('Not enough staked amount.');
	});
});

describe('Stake with errors', () => {
	test('Should show error if can not sign the transaction', async () => {
		spyOnUseSelector.mockReturnValue([]);
		getSignedStakeDeploy.mockRejectedValue(new Error('Signed error'));
		const stakedValidator = {
			validator: '0x11',
			info: {
				bidInfo: {
					bid: {
						delegation_rate: 2,
						staked_amount: 3000000000,
					},
				},
			},
			stakedAmount: 1000,
			tokenSymbol: 'CSPR',
		};
		const { getByText, container, queryByText } = render(
			<UnDelegateForm
				fromAddress="0x000"
				balance={999999}
				fee={1}
				stakedValidator={stakedValidator}
				tokenSymbol="CSPR"
			/>,
		);

		const undelegateBtn = container.querySelector('.cd_undelegate_btn');
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: 9 },
			});
		});

		await act(async () => {
			fireEvent.click(undelegateBtn);
		});

		await act(async () => {
			fireEvent.click(getByText('Confirm'));
		});

		expect(queryByText('Signed error').textContent).toBe('Signed error');
	});

	test('Should show error if can not put the deploy', async () => {
		spyOnUseSelector.mockReturnValue([]);
		getSignedStakeDeploy.mockReturnValue({});
		mockDispatch.mockRejectedValue(new Error('Failed to put deploy'));
		const stakedValidator = {
			validator: '0x11',
			info: {
				bidInfo: {
					bid: {
						delegation_rate: 2,
						staked_amount: 3000000000,
					},
				},
			},
			stakedAmount: 1000,
			tokenSymbol: 'CSPR',
		};
		const { getByText, container, queryByText } = render(
			<UnDelegateForm
				fromAddress="0x000"
				balance={999999}
				fee={1}
				stakedValidator={stakedValidator}
				tokenSymbol="CSPR"
			/>,
		);

		const unDelegateBtn = container.querySelector('.cd_undelegate_btn');
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: 9 },
			});
		});

		await act(async () => {
			fireEvent.click(unDelegateBtn);
		});

		await act(async () => {
			fireEvent.click(getByText('Confirm'));
		});

		expect(queryByText('Failed to put deploy').textContent).toBe('Failed to put deploy');

		await act(async () => {
			fireEvent.click(getByText('Close'));
		});

		expect(container.querySelector('.cd_confirm_modal_content')).toBeNull();
	});
});

describe('Sucess to undelegate the valid amount', () => {
	test('Should show deploy hash', async () => {
		spyOnUseSelector.mockReturnValue([]);
		getSignedStakeDeploy.mockReturnValue({
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
		const stakedValidator = {
			validator: '0x11',
			info: {
				bidInfo: {
					bid: {
						delegation_rate: 2,
						staked_amount: 3000000000,
					},
				},
			},
			stakedAmount: 1000,
			tokenSymbol: 'CSPR',
		};
		const { getByText, container, queryAllByText } = render(
			<UnDelegateForm
				fromAddress="0x000"
				balance={999999}
				fee={1}
				stakedValidator={stakedValidator}
				tokenSymbol="CSPR"
			/>,
		);

		const undelegateBtn = container.querySelector('.cd_undelegate_btn');
		const stakeAmountInput = container.querySelector('.cd_send_currency_input');
		await act(async () => {
			fireEvent.change(stakeAmountInput, {
				target: { value: 9 },
			});
		});

		await act(async () => {
			fireEvent.click(undelegateBtn);
		});

		await act(async () => {
			fireEvent.click(getByText('Confirm'));
		});

		expect(queryAllByText('0x113')[0].textContent).toBe('0x113');
	});
});
