import { KeyFactory } from 'casper-storage';

export const toEncodedPhrase = (keyPhrase) => {
	const keyManager = KeyFactory.getInstance();
	return keyManager.toKey(keyPhrase, true);
};
