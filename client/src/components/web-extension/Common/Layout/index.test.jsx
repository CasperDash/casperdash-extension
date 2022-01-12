/* eslint-disable react/no-multi-comp */
import React from 'react';
import * as redux from 'react-redux';
import { useLocation } from 'react-router-dom';
import { render, cleanup } from '@testing-library/react';
import Layout from './index';

afterEach(cleanup);
let spyOnUseSelector;
let spyOnUseDispatch;
let mockDispatch;
beforeEach(() => {
	// Mock useSelector hook
	spyOnUseSelector = jest.spyOn(redux, 'useSelector');
	spyOnUseDispatch = jest.spyOn(redux, 'useDispatch');
	// Mock dispatch function returned from useDispatch
	mockDispatch = jest.fn();
	spyOnUseDispatch.mockReturnValue(mockDispatch);
});

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	Outlet: () => <div />,
	useLocation: jest.fn(),
}));

jest.mock('../Header', () => ({
	Header: () => <div>Header</div>,
	InnerHeader: () => <div>Inner Header</div>,
}));

jest.mock('./BottomBar', () => ({
	__esModule: true,
	default: () => <div>Bottom Bar</div>,
}));

test('Should show inner header', () => {
	spyOnUseSelector.mockReturnValue();
	useLocation.mockReturnValue({ pathname: 'test' });
	const { getByText, container } = render(<Layout />);
	expect(getByText('Inner Header').textContent).toBe('Inner Header');
	expect(Boolean(container.querySelector('.loading_indicator'))).toBe(true);
});

test('Should show header and bottom bar', () => {
	spyOnUseSelector.mockReturnValue(true);
	useLocation.mockReturnValue({ pathname: 'test' });
	const { getByText } = render(<Layout modules={[{ route: 'test' }]} />);
	expect(getByText('Bottom Bar').textContent).toBe('Bottom Bar');
	expect(getByText('Header').textContent).toBe('Header');
});
