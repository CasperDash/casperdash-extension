/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import SideBar from './index';

afterEach(cleanup);
jest.mock('react-router-dom', () => {
	return {
		Link: ({ children }) => <div>{children}</div>,
	};
});

test('Should render page list', () => {
	const { getByText } = render(<SideBar modules={['/dashboard', '/tokens', '/history', '/NFTs']} />);
	expect(getByText('Dashboard').textContent).toBe('Dashboard');
	expect(getByText('Tokens').textContent).toBe('Tokens');
	expect(getByText('History').textContent).toBe('History');
	expect(getByText('NFTs').textContent).toBe('NFTs');
});

test('Should collapse sidebar when click on collapse button', () => {
	const { getByText, container } = render(<SideBar modules={['/dashboard', '/tokens', '/history', '/NFTs']} />);
	const collapseBtn = container.querySelector('.cd_page_sidebar_toggle_btn');
	fireEvent.click(collapseBtn);
	expect(getByText('Dashboard').textContent).toBe('Dashboard');
	expect(getByText('Tokens').textContent).toBe('Tokens');
	expect(getByText('History').textContent).toBe('History');
	expect(getByText('NFTs').textContent).toBe('NFTs');
	expect(container.querySelector('.cd_hide_sidebar').className.includes('cd_hide_sidebar')).toBe(true);
});
