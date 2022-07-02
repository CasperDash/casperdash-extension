import React, { useCallback, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import drop from 'lodash-es/drop';
import dropRight from 'lodash-es/dropRight';
import useCreateWalletStore from './useCreateWallet';
import './RecoveryPhrasePage.scss';

const RecoveryPhrasePage = () => {
  const { keyPhrase, onGenerateKeyphrase, currentStep, setNextStep } = useCreateWalletStore();
  const TOTAL_KEYWORDS = 12;
  const arrKeys = keyPhrase?.split(' ');
  const leftKeys = dropRight(arrKeys, TOTAL_KEYWORDS / 2);
  const rightKeys = drop(arrKeys, TOTAL_KEYWORDS / 2);
  const onClickNextHandler = useCallback(() => {
    setNextStep();
  }, [setNextStep]);

  useEffect(() => {
    onGenerateKeyphrase();
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
        <Button className="cd_we_btn-next" nClick={onClickNextHandler}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default RecoveryPhrasePage;
