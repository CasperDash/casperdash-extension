import React, { useCallback, useReducer, createContext } from "react";
import { WalletDescriptor, StorageManager as Storage, User, KeyFactory, EncryptionType } from "casper-storage";
import dropRight from 'lodash-es/dropRight';
import { initialState, reducer } from "./reducer";
import { shuffle } from "./utils";

const CreateWalletContext = createContext();

const CreateWalletProvider = props => {
  const { children } = props;
  const keyManager = KeyFactory.getInstance();
  const [ state, dispatch ] = useReducer(reducer, {
    ...initialState
  });

  const generateKeyphraseMap = useCallback(keyphrase => {
    const map = new Map();
    keyphrase.split(" ").forEach((word, index) => map.set(index, word));
    return map;
  }, []);

  const generateKeyphraseArray = useCallback(() => {
    return  [...(new Array(state.totalKeywords)).keys()]
  }, [state]);

  const onGenerateKeyphrase = useCallback(() => {
    const keyphrase = keyManager.generate();
    const seed = keyManager.toSeed(keyphrase);
    console.log(`🚀 ~ onGenerate ~ keyphrase`, keyphrase.split(" "));
    console.log(`🚀 ~ onGenerate ~ seed`, seed)
    
    dispatch({
      type: "CREATE_WALLET/CREATE_KEYPHRASE",
      payload: { keyphrase, map: generateKeyphraseMap(keyphrase) }
    });

    // const isValid = keyManager.validate(keyphrase);
    // console.log(`🚀 ~ onGenerate ~ isValid`, isValid);

    // Create User
    // onCreateUser(keyphrase); 
  }, [generateKeyphraseMap, keyManager]);

  const onGenerateWordcheck = useCallback(() => {
    const { totalWordCheck } = state;
    const initWordKeys = generateKeyphraseArray();
    const randomWordIds = (shuffle(initWordKeys)).splice(0, totalWordCheck);

    let final = {};
    randomWordIds.forEach(id => {
      const newWordArr = generateKeyphraseArray();
      const excludedWordIds = newWordArr.filter(k => k !== id);
      const newRandom = shuffle(excludedWordIds);
      const remaining = dropRight(newRandom, newRandom.length - 2);
      final[id] = { answer: id, options: [...shuffle([...remaining, id])]};
    });
    console.log(`🚀 ~ onGenerateWordcheck ~ final`, final)

    return { checklist: randomWordIds, data: final };
  }, [generateKeyphraseArray, state]);

  const value = {
    ...state,
    onGenerateKeyphrase,
    onGenerateWordcheck,
    setNextStep: () => dispatch({ type: "CREATE_WALLET/NEXT_STEP"}),
    setPrevStep: () => dispatch({ type: "CREATE_WALLET/PREVIOUS_STEP"})
  }

  return (
    <CreateWalletContext.Provider value={value}>
      {children}
    </CreateWalletContext.Provider>
  )
}

export { CreateWalletContext };
export default CreateWalletProvider;
