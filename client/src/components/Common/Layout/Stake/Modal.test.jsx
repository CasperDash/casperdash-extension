import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ConfirmationModal from './Modal';
afterEach(cleanup);

test('When not deploying, show confirm button', () => {
	const { queryAllByText } = render(<ConfirmationModal show={true} />);
	expect(queryAllByText('Confirm')[0].textContent).toBe('Confirm');
});

test('When deploying, show confirming button', () => {
	const { queryAllByText } = render(<ConfirmationModal show={true} isDeploying={true} />);
	expect(queryAllByText('Confirming...')[0].textContent).toBe('Confirming...');
});
