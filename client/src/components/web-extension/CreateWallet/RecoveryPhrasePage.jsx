import React, { useCallback, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import drop from 'lodash-es/drop';
import dropRight from 'lodash-es/dropRight';
import { generateKeyphrase } from "@cd/actions/createWalletActions";
import { selectCreateWalletTotalKeywords, selectCreateWalletKeyphraseAsMap } from "@cd/selectors/createWallet";
import useCreateWalletStore from './useCreateWallet';
import './RecoveryPhrasePage.scss';

const RecoveryPhrasePage = () => {
  const dispatch = useDispatch();
  const { setNextStep } = useCreateWalletStore();
  const keyPhraseAsMap = useSelector(selectCreateWalletKeyphraseAsMap);
  const TOTAL_KEYWORDS = useSelector(selectCreateWalletTotalKeywords);
  const keyPhraseAsArray = Array.from(keyPhraseAsMap.values());
  const leftKeys = dropRight(keyPhraseAsArray, TOTAL_KEYWORDS / 2);
  const rightKeys = drop(keyPhraseAsArray, TOTAL_KEYWORDS / 2);
  const onClickNextHandler = useCallback(() => {
    setNextStep();
  }, [setNextStep]);

  useEffect(() => {
    dispatch(generateKeyphrase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cd_we_create-wallet-layout--root">
      <div className="cd_we_create-wallet-layout--body cd_we_create-keyphrase--box">
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
