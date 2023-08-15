import { KeyFactory } from 'casper-storage';

const WORDS_LENGTH_MAP = new Map([
	[128, 12],
	[160, 15],
	[192, 18],
	[224, 21],
	[256, 24],
]);

export const getWord = (entropy, index) => {
	const keyManager = KeyFactory.getInstance();
	return keyManager.getWordAt(entropy, index, true);
};

export const getPhraseLength = (entropy) => {
	return entropy ? WORDS_LENGTH_MAP.get(entropy.length * 8) : 12;
};
