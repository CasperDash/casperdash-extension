import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Button } from 'react-bootstrap';
import every from "lodash-es/every";
import useCreateWalletStore from "./useCreateWallet";
import WordsGroup from "./WordsGroup";
import "./ValidateKeyphrase.scss";

const ValidateKeyphrasePage = () => {
  const { setNextStep, answerSheet, onUpdateAnswerSheet, onCreateAnswerSheet, keyPhraseAsMap, currentStep, onGenerateWordcheck, totalWordCheck } = useCreateWalletStore();
  const [wordsTemplate, setTemplate] = useState(undefined);
  const shouldDisableNextButton = useMemo(() => {
    if (answerSheet) {
      return every(answerSheet, Boolean) ? false : true;
    }
    return true;
  }, [answerSheet]);
  
  const onClickHandler = useCallback(() => {
    if (shouldDisableNextButton) {
      return;
    }

    setNextStep();
  }, [setNextStep, shouldDisableNextButton]);

  const onWordSelectHandler = useCallback((groupIndex, answer) => {
    if (!answerSheet) {
      return;
    }

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
      onUpdateAnswerSheet(groupIndex, true);
    } else {
      onUpdateAnswerSheet(groupIndex, false);
    }
  }, [answerSheet, onUpdateAnswerSheet, wordsTemplate]);

  /**
   * Run only once
   * Generate answer array from index to actual word
   */
  useEffect(() => {
    if (wordsTemplate) {
      return;
    }

    const { checklist, data } = onGenerateWordcheck();
    onCreateAnswerSheet(checklist);

    const checks = checklist.map(id => {
      const arr = data[id].options.map(wordId => keyPhraseAsMap.get(wordId));
      return {
        answer: { id, text: keyPhraseAsMap.get(id)},
        value: null,
        options: arr
      }
    });

    setTemplate(checks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (currentStep !== 1 || !wordsTemplate?.length) {
    return null;
  }

  return (
    <div className="cd_we_create-wallet-layout--root">
      <div className="cd_we_create-wallet-layout--body">
        <p>You need to choose {totalWordCheck} correct words to complete</p>
        <div className="cd_we_validate-keyphrase--wrapper">
          {wordsTemplate.map((group, groupIndex) => {
            return (
              <WordsGroup key={`group-${groupIndex}`} groupIndex={groupIndex} onSelect={onWordSelectHandler} data={group} />
            )
          })}
        </div>
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