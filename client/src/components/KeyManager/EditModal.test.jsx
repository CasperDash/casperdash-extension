import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { EditModal } from './EditModal';

afterEach(cleanup);

test('Display all keys', () => {
	const { getByText, getByPlaceholderText } = render(<EditModal show field="weight" handleEditValue={() => {}} />);

	expect(getByText('Save').textContent).toBe('Save');
	const input = getByPlaceholderText('Weight');
	fireEvent.change(input, { target: { value: '100' } });
	expect(input.value).toBe('100');
});

test('Do nothing if handleEditValue is not function', () => {
	const { getByPlaceholderText } = render(<EditModal show field="weight" value={2} />);

	const input = getByPlaceholderText('Weight');
	fireEvent.change(input, { target: { value: '100' } });
	expect(input.value).toBe('2');
});
