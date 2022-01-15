import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Settings from './';

jest.mock('qrcode.react', () => ({ __esModule: true, default: () => <div>QRCode</div> }));

afterEach(cleanup);

test('Should setting options', async () => {
	const { getByText } = render(<Settings />);

	expect(getByText('About Us').textContent).toBe('About Us');
	expect(getByText('Lock').textContent).toBe('Lock');
});
