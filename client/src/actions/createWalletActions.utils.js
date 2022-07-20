import reduce from 'lodash-es/reduce';
import dropRight from 'lodash-es/dropRight';
import filter from 'lodash-es/filter';

/** Randomize array */
function shuffle(array) {
	let i = array.length,
		j = 0,
		temp;

	while (i--) {
		j = Math.floor(Math.random() * (i + 1));

		// swap randomly chosen element with current element
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}

const generateCWHeader = (currentStep, answerSheet) => {
	switch (currentStep) {
		case 1: {
			const defaultName = 'Double check';
			if (answerSheet) {
				/**
				 * Comment out below line to cheat seeing answer sheet
				 */
				console.log(`🚀 ~ generateCWHeader ~ answerSheet`, answerSheet);
				const count = filter(answerSheet, (value) => value !== null);

				if (!count?.length) {
					return defaultName;
				}

				return `Double check (${count?.length}/${Object.keys(answerSheet).length})`;
			}
			return defaultName;
		}
		case 2:
			return 'Enter password';
		default:
			return 'Recovery Phrase';
	}
};

const generateKeyphraseMap = keyphrase => {
  const map = new Map();
  keyphrase.split(" ").forEach((word, index) => map.set(index, word));
  return map;
};

/**
   * E.g: [1,2,3...11,12]
   */
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

/**
   * Randomize words from generated keyphrase
   * Given how many words we'd like to validate,
   * This will create a random index object using key index only (based on keyphrase generated)
   * For word conversion, this will be done in actual UI
   */
  const onGenerateWordcheck = totalWordCheck => {
    const initWordKeys = generateKeyphraseArray(totalWordCheck);
    const randomWordIds = (shuffle(initWordKeys)).splice(0, totalWordCheck);

    /**
     * Idea:
     * For each key index:
     *  - Create another shuffled array from total keyphrase (excluding the current key)
     *  - Take 2 first elements from the shuffled in Step 1
     *  - Create a shuffled array from [2 first elements, current key]
     */
    let final = {};
    randomWordIds.forEach(id => {
      const newWordArr = generateKeyphraseArray(totalWordCheck);
      const excludedWordIds = newWordArr.filter(k => k !== id);
      const newRandom = shuffle(excludedWordIds);
      const remaining = dropRight(newRandom, newRandom.length - 2);
      final[id] = { answer: id, options: [...shuffle([...remaining, id])]};
    });

    return { checklist: randomWordIds, data: final };
  }

export {
  onGenerateWordcheck,
  generateCWHeader,
  generateKeyphraseArray,
  generateKeyphraseMap,
  convertKeyphraseToAnswerObject
}