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

  /**
   * E.g: [1,2,3...11,12]
   */
  const generateKeyphraseArray = useCallback(() => {
    return  [...(new Array(state.totalKeywords)).keys()]
  }, [state]);

  /**
   * Generating a keyphrase of 12 words
   * Then convert result into Map object for re-use in word validating
   */
  // const onGenerateKeyphrase = useCallback(() => {
  //   const keyphrase = keyManager.generate();
  //   console.log(`🚀 ~ onGenerate ~ keyphrase`, keyphrase.split(" "));

  //   dispatch({
  //     type: "CREATE_WALLET/CREATE_KEYPHRASE",
  //     payload: { keyphrase, map: generateKeyphraseMap(keyphrase) }
  //   });

  //   // const isValid = keyManager.validate(keyphrase);
  //   // console.log(`🚀 ~ onGenerate ~ isValid`, isValid);
  // }, [generateKeyphraseMap, keyManager]);

  /**
   * Randomize words from generated keyphrase
   * Given how many words we'd like to validate,
   * This will create a random index object using key index only (based on keyphrase generated)
   * For word conversion, this will be done in actual UI
   */
  const onGenerateWordcheck = useCallback(() => {
    const { totalWordCheck } = state;
    const initWordKeys = generateKeyphraseArray();
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
      const newWordArr = generateKeyphraseArray();
      const excludedWordIds = newWordArr.filter(k => k !== id);
      const newRandom = shuffle(excludedWordIds);
      const remaining = dropRight(newRandom, newRandom.length - 2);
      final[id] = { answer: id, options: [...shuffle([...remaining, id])]};
    });

    return { checklist: randomWordIds, data: final };
  }, [generateKeyphraseArray, state]);

  // const onCreateAnswerSheet = useCallback(idKeys => {
  //   dispatch({
  //     type: "CREATE_WALLET/SET_ANSWER_SHEET",
  //     payload: convertKeyphraseToAnswerObject(idKeys)
  //   })
  // }, [dispatch]);

  // const onUpdateAnswerSheet = useCallback((groupIdx, value) => {
  //   dispatch({
  //     type: "CREATE_WALLET/UPDATE_ANSWER_SHEET",
  //     payload: {
  //       groupIdx,
  //       value
  //     }
  //   })
  // }, [dispatch]);

  const value = {
    ...state,
    // onGenerateKeyphrase,
    onGenerateWordcheck,
    // onCreateAnswerSheet,
    // onUpdateAnswerSheet,
    // onResetWalletCreation: () => dispatch({ type: "CREATE_WALLET/RESET"}),
    // setNextStep: () => dispatch({ type: "CREATE_WALLET/NEXT_STEP"}),
    // setPrevStep: () => dispatch({ type: "CREATE_WALLET/PREVIOUS_STEP"})
  }

  return (
    <CreateWalletContext.Provider value={value}>
      {children}
    </CreateWalletContext.Provider>
  )
}

export { CreateWalletContext };
export default CreateWalletProvider;
