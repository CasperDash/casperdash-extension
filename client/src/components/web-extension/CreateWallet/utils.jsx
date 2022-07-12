import { ValidatorUtils } from "casper-storage";
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
      [index]: null
      // [index]: false // Only used when couting on correct answer
    }
  }, {});
}

const generateCWHeader = (currentStep, answerSheet) => {
  switch(currentStep) {
    case 1: {
      const defaultName = "Double check";
      if (answerSheet) {
        /**
         * Comment out below line to cheat seeing answer sheet
         */
        console.log(`🚀 ~ generateCWHeader ~ answerSheet`, answerSheet)
        const count = filter(answerSheet, value => value !== null);

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

const isStrongPassword = password => ValidatorUtils.verifyStrongPassword(password)?.status ?? false;

export {
  shuffle,
  generateCWHeader,
  convertKeyphraseToAnswerObject,
  isStrongPassword
}