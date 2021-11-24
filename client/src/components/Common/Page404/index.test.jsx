/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Page404Module from './index';

afterEach(cleanup);
jest.mock('react-router-dom', () => {
	return {
		Link: () => <div />,
	};
});

test('Should return 404 page', () => {
	const { getByText } = render(<Page404Module />);
	expect(getByText('Page not found.').textContent).toBe('Page not found.');
	expect(getByText('404').textContent).toBe('404');
});
