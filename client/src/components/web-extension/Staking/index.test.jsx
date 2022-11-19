import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Staking from './';

afterEach(cleanup);

jest.mock('../../../helpers/validator', () => ({
	validateStakeForm: () => {},
}));

test('Should show stake form and no staked info', async () => {
	useLocation.mockReturnValue({});
	useSelector.mockReturnValue([]);
	const { getByText, container } = render(<Staking />);
	expect(getByText('Validator').textContent).toBe('Validator');
	expect(getByText('Amount').textContent).toBe('Amount');
	expect(getByText('Stake Now').textContent).toBe('Stake Now');
	expect(getByText('Staked Information').textContent).toBe('Staked Information');

	fireEvent.click(container.querySelector('.cd_we_staking_validator_box'));
	expect(useNavigate()).toHaveBeenCalled();
});

test('Should show stake form and no staked info', async () => {
	useLocation.mockReturnValue({});
	useSelector.mockReturnValue([]);
	const { getByText } = render(<Staking />);
	expect(getByText('Validator').textContent).toBe('Validator');
	expect(getByText('Amount').textContent).toBe('Amount');
	expect(getByText('Stake Now').textContent).toBe('Stake Now');
	expect(getByText('Staked Information').textContent).toBe('Staked Information');
	expect(getByText('No Data').textContent).toBe('No Data');
});

test('Should navigate to stake confirm', async () => {
	useLocation.mockReturnValue({ state: { validator: { public_key: 'validatorkey' } } });
	useSelector.mockReturnValue([]);
	const { getByText, container } = render(<Staking />);

	expect(getByText('validat').textContent).toBe('validat');

	const amountField = container.querySelector('.cd_we_staking_amount_text_box input');
	await fireEvent.change(amountField, { target: { value: 100 } });
	expect(amountField.value).toBe('100');

	await fireEvent.click(getByText('Stake Now'));
	expect(useNavigate()).toHaveBeenCalled();
});
