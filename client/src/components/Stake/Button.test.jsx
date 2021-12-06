import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Button from './Button';
afterEach(cleanup);

test('Show the stake button', () => {
	const { queryAllByText } = render(<Button show={true} />);
	expect(queryAllByText('Stake CSPR')[0].textContent).toBe('Stake CSPR');
});

test('Hide the stake button', () => {
	const { container } = render(<Button />);
	expect(container.querySelector('.hide')).not.toBeNull();
});
