import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TokenSelectField from './TokenSelectField';

afterEach(cleanup);

test('Should show token field ', async () => {
	const { container } = render(
		<TokenSelectField options={[{ label: 'CSPR', value: 'Casper' }]} field={{ name: 'test' }} />,
	);
	expect(container.querySelector("input[name='test']").value).toBe('Casper');
});
