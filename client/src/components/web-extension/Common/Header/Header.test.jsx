import React from 'react';
import * as redux from 'react-redux';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Header } from './Header';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedUsedNavigate,
}));

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

test('Should show setting icon', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce('test');

	const { container } = render(<Header currentModule={{ route: '/' }} />);
	expect(Boolean(container.querySelector('.cd_we_logo'))).toBe(true);
	expect(Boolean(container.querySelector('.cd_we_settings'))).toBe(true);
	fireEvent.click(container.querySelector('.cd_we_settings'));
	expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
});

test('Should not show setting icon', () => {
	spyOnUseSelector.mockReturnValue([]).mockReturnValueOnce('');

	const { container } = render(<Header />);

	expect(Boolean(container.querySelector('.cd_we_settings'))).toBe(false);
});
