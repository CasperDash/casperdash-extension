import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { MessageModal } from './MessageModal';
afterEach(cleanup);

describe('ModalRow', () => {
	test('Should render MessageModal with type, message', () => {
		const { queryAllByText } = render(<MessageModal show={true} type="Type A" message="This is type A" />);
		expect(queryAllByText('Type A')[0].textContent).toBe('Type A');
		expect(queryAllByText('This is type A')[0].textContent).toBe('This is type A');
	});
});
