import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ConfirmationModal from './Modal';
afterEach(cleanup);

describe('ConfirmationModal', () => {
	test('When not deploying, show confirm button', () => {
		const { queryAllByText } = render(<ConfirmationModal show={true} />);
		expect(queryAllByText('Confirm')[0].textContent).toBe('Confirm');
	});

	test('When deploying, show confirming button', () => {
		const { queryAllByText } = render(<ConfirmationModal show={true} isDeploying={true} />);
		expect(queryAllByText('Confirming...')[0].textContent).toBe('Confirming...');
	});

	test('When having deploy hash, show close button', () => {
		const { queryAllByText } = render(<ConfirmationModal show={true} deployHash="0x12" />);
		expect(queryAllByText('Close')[0].textContent).toBe('Close');
	});
});
