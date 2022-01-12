/* eslint-disable react/no-multi-comp */
import React from 'react';
import { render } from '@testing-library/react';
import OuterLayout from './OuterLayout';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	Outlet: () => <div />,
}));

jest.mock('../Header/OuterHeader', () => ({
	OuterHeader: () => <div />,
}));

test('Should show outer content', () => {
	const { container } = render(<OuterLayout />);

	expect(Boolean(container.querySelector('.cd_all_pages_content'))).toBe(true);
	expect(Boolean(container.querySelector('.cd_web_extension_outer_content'))).toBe(true);
});
