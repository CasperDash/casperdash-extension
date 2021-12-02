import { render, cleanup } from '@testing-library/react';
import ConfirmingTransactionsInfo from './ConfirmingTransactionsInfo';
afterEach(cleanup);

describe('ConfirmingTransactionsInfo', () => {
	test('Should return undefined if there is no transactions', () => {
		expect(ConfirmingTransactionsInfo()).toBe(undefined);
	});

	test('Render when there are more than two transactions', () => {
		const { queryAllByText } = render(ConfirmingTransactionsInfo([1, 2]));
		expect(queryAllByText('Confirming transactions ...')[0].textContent).toBe('Confirming transactions ... ');
	});

	test('Render when there is only transactions', () => {
		const { queryAllByText } = render(ConfirmingTransactionsInfo([1]));
		expect(queryAllByText('Confirming transaction ...')[0].textContent).toBe(
			'Confirming transaction ... View on explorer',
		);
	});
});
