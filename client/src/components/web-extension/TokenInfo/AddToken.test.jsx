/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { AddToken } from './AddToken';

afterEach(cleanup);

test('Should show add token form', async () => {
	const { getByText, getByPlaceholderText } = render(<AddToken />);
	expect(getByText('Token Address').textContent).toBe('Token Address');
	expect(getByText('Add').textContent).toBe('Add');
	const tokenAddressInput = getByPlaceholderText('Enter token address');
	await fireEvent.change(tokenAddressInput, { target: { value: 'test' } });
	expect(tokenAddressInput.value).toBe('test');
});
