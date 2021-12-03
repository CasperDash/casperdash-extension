import { render, cleanup } from '@testing-library/react';
import EmptyDelegation from './EmptyDelegation';
afterEach(cleanup);

describe('EmptyDelegation', () => {
	test('When loading', () => {
		const { queryAllByText } = render(<EmptyDelegation isLoading={true} />);
		expect(queryAllByText('Loading validators')[0].textContent).toBe('Loading validators');
	});
	test('When not loading', () => {
		const { queryAllByText } = render(<EmptyDelegation isLoading={false} />);
		expect(
			queryAllByText(
				'You do not have any delegations yet. Stake CSPR, earn rewards and help Capser become more secure!',
			)[0].textContent,
		).toBe('You do not have any delegations yet. Stake CSPR, earn rewards and help Capser become more secure!');
	});
});
