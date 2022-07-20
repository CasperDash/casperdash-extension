import reduce from 'lodash-es/reduce';

const generateKeyphraseMap = keyphrase => {
  const map = new Map();
  keyphrase.split(" ").forEach((word, index) => map.set(index, word));
  return map;
};

const generateKeyphraseArray = totalKeywords => {
  return  [...(new Array(totalKeywords)).keys()]
};

const convertKeyphraseToAnswerObject = (keyphrase) => {
	return reduce(
		keyphrase,
		(result, _, index) => {
			return {
				...result,
				[index]: null,
				// [index]: false // Only used when couting on correct answer
			};
		},
		{},
	);
};

export {
  generateKeyphraseArray,
  generateKeyphraseMap,
  convertKeyphraseToAnswerObject
}