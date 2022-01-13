import React from 'react';
import { render, cleanup } from '@testing-library/react';
import KeyList from './KeyList';

afterEach(cleanup);

test('Display all keys', () => {
	const { getByText } = render(<KeyList associatedKeys={[{ accountHash: 'test', weight: 10 }]} />);
	expect(getByText('test').textContent).toBe('test');
	expect(getByText('10').textContent).toBe('10');
});
