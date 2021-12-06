import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ValidatorInfo from './ValidatorInfo';

afterEach(cleanup);

describe('ValidatorInfo', () => {
	test('Should show bid info', () => {
		const info = {
			bidInfo: {
				bid: {
					delegation_rate: 3,
					staked_amount: 10,
				},
			},
		};
		const { queryAllByText } = render(<ValidatorInfo info={info} />);
		expect(queryAllByText('3%')[0].textContent).toBe('3%');
	});

	test('Should show the common actions', () => {
		const info = {
			bidInfo: {
				bid: {
					delegation_rate: 3,
					staked_amount: 10,
				},
			},
		};
		const { container } = render(<ValidatorInfo info={info} validator="0x123" />);
		expect(container.querySelector('.cd_btn_copy')).not.toBeNull();
		expect(container.querySelector('.cd_btn_explorer')).not.toBeNull();
	});
});
