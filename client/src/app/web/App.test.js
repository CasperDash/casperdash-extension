import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'),
	Provider: () => <div>App</div>,
}));

test('', () => {
	const { getByText } = render(<App />);
	expect(getByText('App').textContent).toEqual('App');
});
