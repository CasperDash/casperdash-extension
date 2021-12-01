/* eslint-disable react/no-multi-comp */
import React from 'react';
import * as redux from 'react-redux';
import { render } from '@testing-library/react';
import App from './App';
jest.mock('./store', () => {
	return {
		__esModule: true,
		default: jest.fn(),
	};
});
jest.mock('./components/Common/Layout', () => {
	return {
		__esModule: true,
		default: () => <div>Layout</div>,
	};
});

jest.mock('./components', () => {
	return {
		__esModule: true,
		default: [{ test: {} }],
	};
});

const spyProvider = jest.spyOn(redux, 'Provider');

test('Should set selected token info equal empty if click on All Transactions', async () => {
	spyProvider.mockImplementation(({ children }) => (
		<div>
			<div>Provider</div>
			{children}
		</div>
	));
	const { getByText } = render(<App />);

	expect(getByText('Layout').textContent).toBe('Layout');
	expect(getByText('Provider').textContent).toBe('Provider');
});
