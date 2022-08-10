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

describe("Back button", () => {
  it('Should show show back button by default', () => {
    useLocation.mockReturnValueOnce({ state: { name: 'test' } });
    const { queryByTestId, getByText } = render(<OuterHeader />);
    const btnBack = queryByTestId("back-button");
    expect(btnBack).toBeInTheDocument();
    expect(getByText('test').textContent).toBe('test');
    fireEvent.click(btnBack);
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  });

  it.only('Should not show show back button when current screen is WelcomeBack', () => {
    useLocation.mockReturnValueOnce({ pathname: "/welcomeBack", state: { name: 'test' } });
    const { queryByTestId } = render(<OuterHeader />);
    expect(queryByTestId('back-button')).not.toBeInTheDocument();
  });
});

test('Should not show title', () => {
	useLocation.mockReturnValueOnce({});
	const { queryAllByText } = render(<OuterHeader />);

	expect(queryAllByText('test').length).toBe(0);
});
