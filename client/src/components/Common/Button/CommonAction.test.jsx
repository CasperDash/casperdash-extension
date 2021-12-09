import React from 'react';
import { render, fireEvent, cleanup, act } from '@testing-library/react';
import { viewInExplorer } from '../../../helpers/redirect';
import CommonAction from './CommonAction';

afterEach(cleanup);

test('Should show copy and go to explorer button', () => {
	const { container } = render(<CommonAction />);
	expect(container.querySelector('.cd_btn_copy').className.includes('bi-clipboard')).toBe(true);
	expect(container.querySelector('.cd_btn_explorer').className.includes('bi-box-arrow-up-right')).toBe(true);
});

test('Should copy value when clicked on copy', async () => {
	jest.useFakeTimers();
	// jest.spyOn(global, 'setTimeout');
	const mockClipboard = {
		writeText: jest.fn(),
	};
	global.navigator.clipboard = mockClipboard;
	const { container } = render(<CommonAction />);
	await act(async () => {
		fireEvent.click(container.querySelector('.cd_btn_copy'));
		jest.advanceTimersByTime(1001);
	});

	expect(navigator.clipboard.writeText).toBeCalledTimes(1);
	jest.useRealTimers();
});

jest.mock('../../../helpers/redirect', () => {
	return {
		__esModule: true,
		viewInExplorer: jest.fn(() => {}),
	};
});

test('Should invoke viewInExplorer function when clicked on explorer', async () => {
	const { container } = render(<CommonAction />);

	fireEvent.click(container.querySelector('.cd_btn_explorer'));
	expect(viewInExplorer).toBeCalledTimes(1);
});
