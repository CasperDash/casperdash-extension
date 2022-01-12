import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { isValidPublicKey } from '../../../helpers/validator';
import { AddPublicKey } from './AddPublicKey';

afterEach(cleanup);

jest.mock('../../../helpers/validator', () => ({
	isValidPublicKey: jest.fn(),
}));

test('Should show connect options', async () => {
	isValidPublicKey.mockReturnValue(true);

	const { getByText, getByPlaceholderText } = render(<AddPublicKey />);

	expect(getByText(/Public Key/i).textContent).toBe('Public Key');
	const publicKeyInput = getByPlaceholderText('Enter public key');
	await fireEvent.change(publicKeyInput, { target: { value: 'test' } });
	expect(publicKeyInput.value).toBe('test');
	fireEvent.click(getByText('Add'));

	expect(useNavigate()).toHaveBeenCalled();
});

test('Should not add public key if invalid', async () => {
	isValidPublicKey.mockReturnValue(false);

	const { getByText, getByPlaceholderText } = render(<AddPublicKey />);

	const publicKeyInput = getByPlaceholderText('Enter public key');
	await fireEvent.change(publicKeyInput, { target: { value: 'test' } });
	expect(publicKeyInput.value).toBe('test');
	expect(getByText('Invalid public key').textContent).toBe('Invalid public key');
});
