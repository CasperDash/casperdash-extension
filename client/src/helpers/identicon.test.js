import IdentIcon from 'identicon.js';
import { getBase64IdentIcon } from './identicon';

jest.mock('identicon.js', () => ({ __esModule: true, default: jest.fn() }));

test('Should return base64 img src', () => {
	IdentIcon.mockReturnValue(new Object());
	expect(getBase64IdentIcon()).toEqual('data:image/svg+xml;base64,[object Object]');
});

test('Should return default img', () => {
	IdentIcon.mockImplementation(() => {
		throw Error('test');
	});
	expect(getBase64IdentIcon()).toEqual('/assets/images/token-icon.png');
});
