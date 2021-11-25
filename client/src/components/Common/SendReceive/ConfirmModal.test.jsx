import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';

afterEach(cleanup);

test('Should show transaction info', () => {
	const { getByText } = render(<ConfirmModal show />);
	expect(getByText('Confirm transaction').textContent).toBe('Confirm transaction');
	expect(getByText('Sender').textContent).toBe('Sender');
	expect(getByText('Recipient').textContent).toBe('Recipient');
	expect(getByText('Transfer Id (optional)').textContent).toBe('Transfer Id (optional)');
});

test('Should update transfer id', () => {
	const { getByPlaceholderText } = render(<ConfirmModal show />);
	const transferIdInput = getByPlaceholderText('Transfer ID');
	fireEvent.change(transferIdInput, { target: { value: 123123 } });
	expect(transferIdInput.value).toBe('123123');
});

test('Should show deploy hash if any', () => {
	const { getByText } = render(<ConfirmModal show deployHash="testdeployhash" />);
	expect(getByText('testdeployhash').textContent).toBe('testdeployhash');
	expect(getByText('Transaction Hash').textContent).toBe('Transaction Hash');
});

test('Should show total fee in usd ', () => {
	const { getByText } = render(
		<ConfirmModal show deployHash="testdeployhash" amount={100} currentPrice={1} csprPrice={10} fee={2} />,
	);
	expect(getByText('$120.00').textContent).toBe('$120.00');
});

test('Should show loading status when deploying ', () => {
	const { getByText } = render(<ConfirmModal show isDeploying />);
	expect(getByText('Confirming...').textContent).toBe('Confirming...');
});

test('Should call confirm function when click confirm', () => {
	const confirm = jest.fn();
	const { getByText } = render(<ConfirmModal show onConfirm={confirm} />);
	fireEvent.click(getByText('Confirm'));
	expect(confirm).toHaveBeenCalled();
});

test('Should do nothing if onConfirm is not function', () => {
	const { getByText } = render(<ConfirmModal show />);
	fireEvent.click(getByText('Confirm'));
	expect(getByText('Confirm').textContent).toBe('Confirm');
});
