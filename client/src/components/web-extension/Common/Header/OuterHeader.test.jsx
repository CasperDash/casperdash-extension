import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import { OuterHeader } from './OuterHeader';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedUsedNavigate,
	useLocation: jest.fn(),
}));

describe('Back button', () => {
	it('Should show show back button by default', () => {
		const mockSetHeader = jest.fn();
		useLocation.mockReturnValueOnce({ state: { name: 'test' } });
		const { queryByTestId, getByText } = render(<OuterHeader setHeader={mockSetHeader} />);
		const btnBack = queryByTestId('back-button');
		expect(btnBack).toBeInTheDocument();
		expect(getByText('test').textContent).toBe('test');
		fireEvent.click(btnBack);
		expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
	});

	it('Should not show show back button when current screen is WelcomeBack', () => {
		const mockSetHeader = jest.fn();
		useLocation.mockReturnValueOnce({ pathname: '/welcomeBack', state: { name: 'test' } });
		const { queryByTestId } = render(<OuterHeader setHeader={mockSetHeader} />);
		expect(queryByTestId('back-button')).not.toBeInTheDocument();
	});
});

describe("Not showing Header", () => {
	it('Should not show Header when location data is invalid', () => {
		useLocation.mockReturnValueOnce({});
		const { queryAllByText } = render(<OuterHeader />);

		expect(queryAllByText('test').length).toBe(0);
	});

	it('Should not show header when state location data is `undefined`', () => {
		useLocation.mockReturnValueOnce({
			state: undefined
		});
		const { queryAllByText } = render(<OuterHeader />);

		expect(queryAllByText('test').length).toBe(0);
	});

	it('Should not show header when state location data is invalid', () => {
		useLocation.mockReturnValueOnce({
			state: ""
		});
		const { queryAllByText } = render(<OuterHeader />);

		expect(queryAllByText('test').length).toBe(0);
	});
})

