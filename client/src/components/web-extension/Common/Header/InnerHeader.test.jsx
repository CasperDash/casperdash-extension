import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { InnerHeader } from './InnerHeader';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedUsedNavigate,
	useLocation: jest.fn(),
}));

test('Should show show back button', () => {
	useLocation.mockReturnValueOnce({ state: { name: 'test' } });
	const { container, getByText } = render(<InnerHeader setPrevRoute={() => {}} />);
	expect(Boolean(container.querySelector('.cd_we_back_btn'))).toBe(true);
	expect(getByText('test').textContent).toBe('test');
	fireEvent.click(container.querySelector('.cd_we_back_btn'));
	expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
});

test('Should not show title', () => {
	useLocation.mockReturnValueOnce({});
	const { queryAllByText } = render(<InnerHeader />);

	expect(queryAllByText('test').length).toBe(0);
});
