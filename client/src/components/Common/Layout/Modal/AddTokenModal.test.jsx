import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { AddTokenModal } from './AddTokenModal';

afterEach(cleanup);

test('It should update state when input value to token address', () => {
	const { getByPlaceholderText } = render(<AddTokenModal show />);
	const input = getByPlaceholderText('Token Address');
	fireEvent.change(input, { target: { value: 'testaddress' } });
	expect(input.value).toBe('testaddress');
});

test('It should do nothing if handleAddToken is not function', () => {
	const { getByText } = render(<AddTokenModal show handleAddToken="" />);
	const addButton = getByText('Add');
	fireEvent.click(addButton);
	expect(getByText('Add').textContent).toBe('Add');
});
