import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Button } from 'react-bootstrap';
import reduce from 'lodash-es/reduce';
import every from "lodash-es/every";
import useCreateWalletStore from "./useCreateWallet";
import WordsGroup from "./WordsGroup";

const ValidateKeyphrasePage = () => {
  const { keyPhraseAsMap, currentStep, onGenerateWordcheck, totalWordCheck } = useCreateWalletStore();
  const [stage, setStage] = useState(1);
  const [wordsTemplate, setTemplate] = useState(undefined);
  const [answerArray, setAnswerArray] = useState(undefined);
  const shouldDisableNextButton = useMemo(() => {
    if (answerArray) {
      return every(answerArray, Boolean) ? false : true;
    }
    return true;
  }, [answerArray]);
  
  const onClickHandler = useCallback(() => {
  }, []);

  const onWordSelectHandler = useCallback((groupIndex, answer) => {
    if (!answerArray) {
      return;
    }

    // console.log(`>>> `, wordsTemplate[groupIndex].answer?.text, answer)
    // console.log(`🚀 ~ onWordSelectHandler ~ wordsTemplate`, wordsTemplate)
    const newTemplate = wordsTemplate.map((each, index) => {
      if (index === groupIndex) {
        return {
          ...each,
          value: answer
        }
      }

      return each;
    });
    setTemplate(newTemplate);

    if (wordsTemplate[groupIndex].answer?.text === answer) {
      setAnswerArray({
        ...answerArray,
        [groupIndex]: true
      });
    } else {
      setAnswerArray({
        ...answerArray,
        [groupIndex]: false
      });
    }
  }, [answerArray, wordsTemplate]);

  /**
   * Run only once
   * Generate answer array from index to actual word
   */
  useEffect(() => {
    if (wordsTemplate) {
      return;
    }

    const { checklist, data } = onGenerateWordcheck();
    const answerArray = reduce(checklist, (result, curr, index) => {
      return {
        ...result,
        [index]: false
      }
    }, {});

    const checks = checklist.map(id => {
      const arr = data[id].options.map(wordId => keyPhraseAsMap.get(wordId));
      return {
        answer: { id, text: keyPhraseAsMap.get(id)},
        value: null,
        options: arr
      }
    });

    setAnswerArray(answerArray);
    setTemplate(checks);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (currentStep !== 1 || !wordsTemplate?.length) {
    return null;
  }

  return (
    <div className="cd_we_create-keyphrase--wrapper">
      <div className="cd_we_create-keyphrase--validate-wrapper">
        <p>You need to choose {totalWordCheck} correct words to complete</p>
        {wordsTemplate.map((group, groupIndex) => {
          return (
            <WordsGroup key={`group-${groupIndex}`} groupIndex={groupIndex} onSelect={onWordSelectHandler} data={group} />
          )
        })}
      </div>
      <div className="cd_we_page--bottom">
        <Button className="cd_we_btn-next" disabled={shouldDisableNextButton} onClick={onClickHandler}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ValidateKeyphrasePage;