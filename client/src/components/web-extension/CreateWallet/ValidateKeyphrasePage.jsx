import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import every from "lodash-es/every";
import { onGenerateWordcheck } from "@cd/actions/createWalletActions.utils";
import { setNextStep, updateAnswerSheet, createAnswerSheet } from "@cd/actions/createWalletActions";
import { selectCreateWalletState } from '@cd/selectors/createWallet';
import WordsGroup from "./WordsGroup";
import "./ValidateKeyphrase.scss";

const ValidateKeyphrasePage = () => {
  const dispatch = useDispatch();
  const { currentStep, answerSheet, keyPhraseAsMap, totalWordCheck } = useSelector(selectCreateWalletState);
  const [wordsTemplate, setTemplate] = useState(undefined);
  const onUpdateAnswerSheet = useCallback((groupIndex, value) => dispatch(updateAnswerSheet(groupIndex, value)), [dispatch]);
  const onCreateAnswerSheet = useCallback(checklist => dispatch(createAnswerSheet(checklist)), [dispatch]);
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

    dispatch(setNextStep());
  }, [dispatch, shouldDisableNextButton]);

  const onSelecteWordHandler = useCallback((groupIndex, answer) => {
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

    const { checklist, data } = onGenerateWordcheck(totalWordCheck);
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
              <WordsGroup key={`group-${groupIndex}`} groupIndex={groupIndex} onSelect={onSelecteWordHandler} data={group} />
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