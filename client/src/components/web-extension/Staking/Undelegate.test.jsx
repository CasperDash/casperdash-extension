import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Undelegate } from './Undelegate';

afterEach(cleanup);

jest.mock('../../../helpers/validator', () => ({
	validateUndelegateForm: () => {},
}));

test('Should show undelegate form', async () => {
	useLocation.mockReturnValue({});
	useSelector.mockReturnValue({});
	useOutletContext.mockReturnValue([{}, jest.fn()]);
	const { getByText } = render(<Undelegate />);
	expect(getByText('Validator').textContent).toBe('Validator');
	expect(getByText('Amount').textContent).toBe('Amount');
	expect(getByText('Confirm').textContent).toBe('Confirm');

	await fireEvent.click(getByText('Confirm'));
	expect(useNavigate()).toHaveBeenCalledTimes(0);
});

test('Should show update input field', async () => {
	useLocation.mockReturnValue({ state: { validator: 'testvalidator' } });
	useOutletContext.mockReturnValue([{}, jest.fn()]);
	useSelector.mockReturnValue({});
	const { container, getByText } = render(
			<Undelegate />
	);

	const amountField = container.querySelector('.cd_we_staking_amount_text_box input');
	await fireEvent.change(amountField, { target: { value: 100 } });
	expect(amountField.value).toBe('100');

	await fireEvent.click(getByText('Confirm'));
	// expect(useNavigate()).toHaveBeenCalled();
});

test('Should set max amount when click on max button', async () => {
	useLocation.mockReturnValue({ state: { validator: 'testvalidator', stakedAmount: 20 } });
	useSelector.mockReturnValue({});
	useOutletContext.mockReturnValue([{}, jest.fn()]);

	const { container, getByText } = render(<Undelegate />);

	await fireEvent.click(getByText('Max'));
	const amountField = container.querySelector('.cd_we_staking_amount_text_box input');
	expect(amountField.value).toBe('20');
});
