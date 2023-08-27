import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { AccountInfo } from './index';

afterEach(cleanup);
let spyOnUseSelector;
beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSelector = jest.spyOn(redux, 'useSelector');
});

test('Should display account info', () => {
	spyOnUseSelector.mockReturnValueOnce(false).mockReturnValueOnce('test').mockReturnValueOnce(10).mockReturnValue(false);

	const { getByText } = render(<AccountInfo />);
	expect(getByText('test').textContent).toBe('test');
	expect(getByText('$10.00').textContent).toBe('$10.00');
});
