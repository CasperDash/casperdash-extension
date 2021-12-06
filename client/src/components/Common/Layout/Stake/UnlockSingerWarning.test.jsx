import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as redux from 'react-redux';
import UnlockSingerWarning from './UnlockSingerWarning';

afterEach(cleanup);

describe('UnlockSingerWarning', () => {
	test('Should display warning message', async () => {
		// Mock useSelector hook
		const spyOnUseSelector = jest.spyOn(redux, 'useSelector');
		const spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
		const mockDispatch = jest.fn();
		spyOnUseDispatch.mockReturnValue(mockDispatch);

		spyOnUseSelector.mockReturnValue([]);
		const { queryAllByText } = render(<UnlockSingerWarning title="Title" message={'Warning message'} />);

		expect(queryAllByText('Title')[0].textContent).toBe('Title');
		expect(queryAllByText('Warning message')[0].textContent).toBe('Warning message');
	});
});
