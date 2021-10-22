// NIO_COMPONENT ui.packages.nio-crypto
import Crypto from './cryptoServices';
const KEY_SIZE = 512 / 32;
const CryptoId = new Crypto('test', { keySize: KEY_SIZE });

describe('Crypto', () => {
	test('decrypt()', () => {
		expect(CryptoId.decrypt(CryptoId.encrypt('{"test":"test"}'))).toEqual('{"test":"test"}');
	});
	test('decryptJson()', () => {
		expect(CryptoId.decryptJson(CryptoId.encrypt('{"test":"test"}'))).toEqual({ test: 'test' });
	});
});
