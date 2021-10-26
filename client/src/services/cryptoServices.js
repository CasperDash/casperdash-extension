import CryptoJS from 'crypto-js';

export default class Crypto {
	constructor(passWord, options = {}) {
		if (!passWord) {
			throw 'Password required';
		}
		this.salt = options.salt || CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.random(16));

		this.keySize = options.keySize || 512 / 32;
		this.passWord = CryptoJS.PBKDF2(passWord, this.salt, { keySize: this.keySize }).toString();
	}

	encrypt(value) {
		return CryptoJS.AES.encrypt(value, this.passWord).toString();
	}

	decrypt(value) {
		try {
			return CryptoJS.AES.decrypt(value, this.passWord).toString(CryptoJS.enc.Utf8);
		} catch (err) {
			console.error(err);
			return undefined;
		}
	}

	decryptJson(value) {
		const decryptedValue = this.decrypt(value);
		try {
			return JSON.parse(decryptedValue);
		} catch {
			console.error('Invalid JSON');
			return undefined;
		}
	}
}
