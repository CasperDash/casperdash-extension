import {
	isUsingExtension,
	setLocalStorageValue,
	setChromeStorageLocal,
	getChromeStorageLocal,
} from '@cd/services/localStorage';
import { CONNECTED_ACCOUNT_STORAGE_PATH } from '@cd/constants/settings';
import { cacheLoginInfoToLocalStorage, getConnectedAccountChromeLocalStorage } from './userActions.utils';

jest.mock('@cd/services/localStorage', () => ({
	isUsingExtension: jest.fn(),
	setLocalStorageValue: jest.fn(),
	setChromeStorageLocal: jest.fn(),
	getChromeStorageLocal: jest.fn(),
}));

describe('cacheLoginInfoToLocalStorage', () => {
	describe('When being called from webapp', () => {
		it('Should use browser localStorage when being called', async () => {
			isUsingExtension.mockReturnValue(false);
			await cacheLoginInfoToLocalStorage('abc', { a: 'b' });

			expect(setLocalStorageValue).toHaveBeenCalled();
			expect(setLocalStorageValue).toHaveBeenCalledWith(
				'account',
				CONNECTED_ACCOUNT_STORAGE_PATH,
				{
					publicKey: 'abc',
					loginOptions: { a: 'b' },
				},
				'set',
			);
		});
	});

	describe('When being called from extension', () => {
		it('Should use Chrome Storage API when being called from an extension', async () => {
			isUsingExtension.mockReturnValue(true);
			await cacheLoginInfoToLocalStorage('abc', { a: 'b' });

			expect(setChromeStorageLocal).toHaveBeenCalledTimes(2);
			expect(setChromeStorageLocal).toHaveBeenNthCalledWith(1, { key: 'publicKey', value: 'abc' });
			expect(setChromeStorageLocal).toHaveBeenNthCalledWith(2, { key: 'loginOptions', value: { a: 'b' } });
		});
	});
});

describe('getConnectedAccountChromeLocalStorage', () => {
	it('Should call getChromeStorageLocal with publicKey and loginOptions as params', async () => {
		await getConnectedAccountChromeLocalStorage();

		expect(getChromeStorageLocal).toHaveBeenCalledWith(['publicKey', 'loginOptions']);
	});
});
