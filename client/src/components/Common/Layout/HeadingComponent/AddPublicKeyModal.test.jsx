import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { AddPublicKeyModal } from './AddPublicKeyModal';

afterEach(cleanup);

test('Should show add public key modal', () => {
	const { queryAllByText } = render(<AddPublicKeyModal show />);
	expect(queryAllByText('Public Key')[0].textContent).toBe('Public Key');
	expect(queryAllByText('View')[0].textContent).toBe('View');
});

test('Should update input text on change', async () => {
	const { getByPlaceholderText } = render(<AddPublicKeyModal show />);
	const input = getByPlaceholderText('Public key');
	fireEvent.change(input, { target: { value: 'publickeytest' } });
	expect(input.value).toBe('publickeytest');
});

test('Should clear public key on close modal', async () => {
	const { getByPlaceholderText } = render(<AddPublicKeyModal show handleClose={() => {}} />);
	const input = getByPlaceholderText('Public key');
	fireEvent.change(input, { target: { value: 'publickeytest' } });
	expect(input.value).toBe('publickeytest');
});

test('Should clear public key after click view button', async () => {
	const { getByPlaceholderText, getByText } = render(<AddPublicKeyModal show handleAddPublicKey={() => {}} />);
	const viewButton = getByText('View');
	const input = getByPlaceholderText('Public key');
	fireEvent.change(input, { target: { value: 'publickeytest' } });
	expect(input.value).toBe('publickeytest');
	fireEvent.click(viewButton);
	expect(input.value).toBe('publickeytest');
});

test('Should do nothing if handleAddPublicKey is not a function', async () => {
	const { getByPlaceholderText, getByText } = render(<AddPublicKeyModal show />);
	const viewButton = getByText('View');
	const input = getByPlaceholderText('Public key');
	fireEvent.change(input, { target: { value: 'publickeytest' } });
	expect(input.value).toBe('publickeytest');
	fireEvent.click(viewButton);
	expect(input.value).toBe('publickeytest');
});
