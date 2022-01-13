import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import Receive from './';

jest.mock('qrcode.react', () => ({ __esModule: true, default: () => <div>QRCode</div> }));

afterEach(cleanup);

test('Should show qr code and public key', async () => {
	useSelector.mockReturnValue('mockPublicKey');
	const { getByText } = render(<Receive />);

	expect(getByText('QRCode').textContent).toBe('QRCode');
	expect(getByText('mockPublicKey').textContent).toBe('mockPublicKey');
	await fireEvent.click(getByText('Copy'));
	expect(getByText('Copied').textContent).toBe('Copied');
	expect(navigator.clipboard.writeText).toBeCalledTimes(1);
});
