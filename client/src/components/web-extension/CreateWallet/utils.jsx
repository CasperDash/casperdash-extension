import reduce from 'lodash-es/reduce';
import filter from 'lodash-es/filter';

/** Randomize array */
function shuffle(array) {
  let i = array.length,
      j = 0,
      temp;

  while (i--) {
    j = Math.floor(Math.random() * (i+1));

    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

const convertKeyphraseToAnswerObject = keyphrase => {
  return reduce(keyphrase, (result, _, index) => {
    return {
      ...result,
      [index]: false
    }
  }, {});
}

const generateCWHeader = (currentStep, answerSheet) => {
  switch(currentStep) {
    case 1: {
      const defaultName = "Double check";
      if (answerSheet) {
        const count = filter(answerSheet, Boolean);

        if (!count?.length) {
          return defaultName
        }

        return `Double check (${count?.length}/${Object.keys(answerSheet).length})`;
      }
      return defaultName;
    }
    case 2:
      return "Enter password";
    default:
      return "Recovery Phrase"
  }
}

export {
  shuffle,
  generateCWHeader,
  convertKeyphraseToAnswerObject
}