import React from 'react';
import { render } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import WithConfigurations from './';

jest.mock('../../../actions/configurationActions', () => {
	return { getConfigurations: jest.fn() };
});

const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

test('Should show children and dispatch config action', () => {
	useDispatchMock.mockReturnValue({});

	const { getByText } = render(<WithConfigurations>Width Configuration</WithConfigurations>);
	expect(getByText('Width Configuration').textContent).toBe('Width Configuration');
	expect(useDispatchMock).toHaveBeenCalled();
});
