import { render, cleanup } from '@testing-library/react';
import Modal from './Modal';
afterEach(cleanup);

describe('StakeModal', () => {
	it('Can show modal without error', () => {
		const { queryAllByText } = render(
			<Modal
				show={true}
				title="Delegate Modal"
				fromAddress="0x11299999123213232"
				validator="0x11332139923232323"
				amount="999"
				fee="5"
			/>,
		);
		expect(queryAllByText('Delegate Modal')[0].textContent).toBe('Delegate Modal');
		expect(queryAllByText('0x11299999123213232')[0].textContent).toBe('0x11299999123213232');
		expect(queryAllByText('0x11332139923232323')[0].textContent).toBe('0x11332139923232323');
		expect(queryAllByText('999')[0].textContent).toBe('999 CSPR');
		expect(queryAllByText('5')[0].textContent).toBe('5 CSPR');
	});

	it('Can show error', () => {
		const { queryAllByText } = render(<Modal show={true} error="Cannot sign deploy" />);
		expect(queryAllByText('Cannot sign deploy')[0].textContent).toBe('Cannot sign deploy');
	});

	it('Can show close button when having deploy hash', () => {
		const { container, queryAllByText } = render(<Modal show={true} deployHash="0x113" />);
		expect(queryAllByText('Close')[0].textContent).toBe('Close');
	});

	it('Can show deploying button when confirming the deploy', () => {
		const { queryAllByText } = render(<Modal show={true} isDeploying={true} />);
		expect(queryAllByText('Confirming...')[0].textContent).toBe('Confirming...');
	});
});
