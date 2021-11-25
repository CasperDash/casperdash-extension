/* eslint-disable react/no-multi-comp */
import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import { getSignedTransferDeploy } from '../../../services/userServices';
import { getSignedTransferTokenDeploy } from '../../../services/tokenServices';
import { SendReceiveSection } from './index';

jest.mock('../.././../actions/deployActions', () => {
	return {
		putDeploy: () => {},
		pushTransferToLocalStorage: () => {},
	};
});

jest.mock('qrcode.react', () => {
	return {
		__esModule: true,
		default: () => <div />,
	};
});

jest.mock('../../../services/userServices', () => {
	return {
		__esModule: true,
		getSignedTransferDeploy: jest.fn(),
	};
});

jest.mock('../../../services/tokenServices', () => {
	return {
		__esModule: true,
		getSignedTransferTokenDeploy: jest.fn(),
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

test('Should display send receive form', () => {
	spyOnUseSelector.mockReturnValue([]);

	const { queryAllByText } = render(<SendReceiveSection />);
	expect(queryAllByText('Send').length).toBe(2);
	expect(queryAllByText('Receive').length).toBe(1);
});

test('Should set send amount if clicked on preset amount button', () => {
	spyOnUseSelector.mockReturnValue([]);

	const { getByText, container } = render(<SendReceiveSection displayBalance={1000} currentPrice={2} />);
	expect(getByText('Total Balance').textContent).toBe('Total Balance');
	const amountInput = container.querySelector('input[name="sendAmount"]');
	// Display balance = balance - send amount ( default 2.5)
	expect(getByText('997.5').textContent).toBe('997.5');
	expect(amountInput.value).toBe('2.5');
	expect(getByText('$5.00').textContent).toBe('$5.00');
	fireEvent.click(getByText('1/4'));
	expect(amountInput.value).toBe('250');
	expect(getByText('$500.00').textContent).toBe('$500.00');
	fireEvent.click(getByText('Half'));
	expect(amountInput.value).toBe('500');
	expect(getByText('$1,000.00').textContent).toBe('$1,000.00');
	fireEvent.click(getByText('All'));
	expect(amountInput.value).toBe('1000');
	expect(getByText('$2,000.00').textContent).toBe('$2,000.00');
});

describe('Should show error if not valid form when click send', () => {
	const setup = () => {
		spyOnUseSelector.mockReturnValue([]);

		const { getByText, container, queryAllByText, getByPlaceholderText } = render(
			<SendReceiveSection displayBalance={1000} fromAddress="testaddress" />,
		);
		const addressInput = getByPlaceholderText('Insert address');
		const amountInput = container.querySelector('input[name="sendAmount"]');
		const sendBtn = queryAllByText('Send')[1];
		return { getByText, container, queryAllByText, getByPlaceholderText, addressInput, amountInput, sendBtn };
	};
	test('Address is required', async () => {
		const { getByText, sendBtn } = setup();
		await act(async () => {
			fireEvent.click(sendBtn);
		});
		// Address is required
		expect(getByText('Required.').textContent).toBe('Required.');
	});

	test('Must be valid public key', async () => {
		const { getByText, addressInput } = setup();
		await act(async () => {
			fireEvent.change(addressInput, { target: { value: 'test' } });
		});
		// Must be valid public key
		expect(getByText('Invalid address.').textContent).toBe('Invalid address.');
	});
	test('Must be > 2.5 CSPR', async () => {
		const { getByText, addressInput, amountInput } = setup();
		await act(async () => {
			fireEvent.change(addressInput, {
				target: { value: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad' },
			});
		});
		// Must be > 2.5 CSPR
		await act(async () => {
			fireEvent.change(amountInput, { target: { value: -1 } });
		});
		expect(getByText('Amount must be at least 2.5 CSPR.').textContent).toBe('Amount must be at least 2.5 CSPR.');
	});
	test('Must be less than balance', async () => {
		const { getByText, addressInput, amountInput } = setup();
		await act(async () => {
			fireEvent.change(addressInput, {
				target: { value: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad' },
			});
		});
		// Must be > 2.5 CSPR
		await act(async () => {
			fireEvent.change(amountInput, { target: { value: 1111 } });
		});
		expect(getByText('Not enough balance.').textContent).toBe('Not enough balance.');
	});
});

test('Should show confirm modal on click send if form is valid', async () => {
	spyOnUseSelector.mockReturnValue([]);

	const { getByText, queryAllByText, getByPlaceholderText, baseElement } = render(
		<SendReceiveSection displayBalance={1000} fromAddress="testaddress" />,
	);
	const addressInput = getByPlaceholderText('Insert address');
	const sendBtn = queryAllByText('Send')[1];
	await act(async () => {
		fireEvent.change(addressInput, {
			target: { value: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad' },
		});
	});
	await act(async () => {
		fireEvent.click(sendBtn);
	});
	expect(getByText('Confirm transaction').textContent).toBe('Confirm transaction');
	expect(getByText('Sender').textContent).toBe('Sender');
	expect(getByText('Recipient').textContent).toBe('Recipient');
	expect(getByText('Transfer Id (optional)').textContent).toBe('Transfer Id (optional)');
	expect(baseElement.querySelector('.cd_confirm_modal_content').className.includes('show')).toBe(true);
	fireEvent.click(getByText('Close'));
	expect(baseElement.querySelector('.cd_confirm_modal_content').className.includes('show')).toBe(false);
});

test('Should show error if can not sign transaction', async () => {
	spyOnUseSelector.mockReturnValue([]);
	getSignedTransferDeploy.mockReturnValue({ error: { message: 'sign error' } });
	const { getByText, queryAllByText, getByPlaceholderText } = render(
		<SendReceiveSection displayBalance={1000} fromAddress="testaddress" />,
	);
	const addressInput = getByPlaceholderText('Insert address');
	const sendBtn = queryAllByText('Send')[1];
	await act(async () => {
		fireEvent.change(addressInput, {
			target: { value: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad' },
		});
	});
	await act(async () => {
		fireEvent.click(sendBtn);
	});
	await act(async () => {
		fireEvent.click(getByText('Confirm'));
	});
	expect(getByText('sign error').textContent).toBe('sign error');
});

test('Should show dispatch action if no error when confirm cspr transfer transaction', async () => {
	spyOnUseSelector.mockReturnValue([]);
	getSignedTransferDeploy.mockReturnValue({ deploy: { header: { timestamp: '2021' } } });
	mockDispatch.mockReturnValue({ data: 'testdeploy' });
	const { getByText, queryAllByText, getByPlaceholderText } = render(
		<SendReceiveSection displayBalance={1000} fromAddress="testaddress" />,
	);
	const addressInput = getByPlaceholderText('Insert address');
	const sendBtn = queryAllByText('Send')[1];
	await act(async () => {
		fireEvent.change(addressInput, {
			target: { value: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad' },
		});
	});
	await act(async () => {
		fireEvent.click(sendBtn);
	});
	await act(async () => {
		fireEvent.click(getByText('Confirm'));
	});
	expect(mockDispatch).toBeCalledTimes(2);
});

test('Should show dispatch action if no error when confirm token transaction', async () => {
	spyOnUseSelector.mockReturnValue([]);
	getSignedTransferTokenDeploy.mockReturnValue({ deploy: { header: { timestamp: '2021' } } });
	mockDispatch.mockReturnValue({ data: 'testdeploy' });
	const { getByText, queryAllByText, getByPlaceholderText } = render(
		<SendReceiveSection displayBalance={1000} fromAddress="testaddress" tokenSymbol="CDAS" />,
	);
	const addressInput = getByPlaceholderText('Insert address');
	const sendBtn = queryAllByText('Send')[1];
	await act(async () => {
		fireEvent.change(addressInput, {
			target: { value: '0160d88b3f847221f4dc6c5549dcfc26772c02f253a24de226a88b4536bc61d4ad' },
		});
	});
	await act(async () => {
		fireEvent.click(sendBtn);
	});
	await act(async () => {
		fireEvent.click(getByText('Confirm'));
	});
	expect(mockDispatch).toBeCalledTimes(2);
});

test('Should copy address when click on copy button', async () => {
	spyOnUseSelector.mockReturnValue([]);
	const mockClipboard = {
		writeText: jest.fn(),
	};
	global.navigator.clipboard = mockClipboard;
	const { container } = render(<SendReceiveSection displayBalance={1000} fromAddress="testaddress" />);
	fireEvent.click(container.querySelector('.cd_receive_copy_address_content button'));

	expect(navigator.clipboard.writeText).toBeCalledTimes(1);
});
