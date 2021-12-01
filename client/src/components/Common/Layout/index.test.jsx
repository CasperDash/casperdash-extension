/* eslint-disable react/no-multi-comp */
import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import Layout from './index';

afterEach(cleanup);
let spyOnUseDispatch;
let spyOnUseSelector;
let mockDispatch;
beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSelector = jest.spyOn(redux, 'useSelector');
	// Mock useDispatch hook
	spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
	// Mock dispatch function returned from useDispatch
	mockDispatch = jest.fn();
	spyOnUseDispatch.mockReturnValue(mockDispatch);
});

jest.mock('../SideBar', () => {
	return {
		__esModule: true,
		default: () => {
			return <div>Side Bar</div>;
		},
	};
});

jest.mock('../../../actions/deployActions', () => {
	return {
		__esModule: true,
		getLatestBlockHash: () => {},
	};
});

test('Should show side bar component', () => {
	spyOnUseSelector.mockReturnValue(true);
	const { getByText } = render(<Layout />);
	expect(getByText('Side Bar').textContent).toBe('Side Bar');
});

test('Should show loading indicator', () => {
	spyOnUseSelector.mockReturnValue(false);
	const { container } = render(<Layout />);
	expect(container.querySelector('.loading_indicator').className).toBe('loading_indicator');
});
