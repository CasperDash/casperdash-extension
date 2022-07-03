import React, { useCallback, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import drop from 'lodash-es/drop';
import dropRight from 'lodash-es/dropRight';
import useCreateWalletStore from './useCreateWallet';
import './RecoveryPhrasePage.scss';

const RecoveryPhrasePage = () => {
  const { keyPhraseAsMap, onGenerateKeyphrase, totalKeywords: TOTAL_KEYWORDS, setNextStep } = useCreateWalletStore();
  const keyPhraseAsArray = Array.from(keyPhraseAsMap.values());
  const leftKeys = dropRight(keyPhraseAsArray, TOTAL_KEYWORDS / 2);
  const rightKeys = drop(keyPhraseAsArray, TOTAL_KEYWORDS / 2);
  const onClickNextHandler = useCallback(() => {
    setNextStep();
  }, [setNextStep]);

  useEffect(() => {
    onGenerateKeyphrase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cd_we_create-keyphrase--wrapper">
      <div className="cd_we_create-keyphrase--keypharse">
        <ul className="cd_we_create-keyphrase--column">
          {leftKeys?.map((word, index) => (
            <li className="cd_we_keyphrase--word" key={`left-${word}`}>
              <span className="counter">{index + 1}</span>
              <span className="value">{word}</span>
            </li>
          ))}
        </ul>
        <ul className="cd_we_create-keyphrase--column">
          {rightKeys?.map((word, index) => (
            <li className="cd_we_keyphrase--word" key={`right-${word}`}>
              <span className="counter">{index + (1 + TOTAL_KEYWORDS / 2)}</span>
              <span className="value">{word}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="cd_we_page--bottom">
        <Button className="cd_we_btn-next" onClick={onClickNextHandler}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default RecoveryPhrasePage;
