import React, { useCallback, useReducer, createContext } from "react";
import { WalletDescriptor, StorageManager as Storage, User, KeyFactory, EncryptionType } from "casper-storage";
import { initialState, reducer } from "./reducer";

const CreateWalletContext = createContext();

const CreateWalletProvider = props => {
  const { children } = props;
  const keyManager = KeyFactory.getInstance();
  const [ state, dispatch ] = useReducer(reducer, {
    ...initialState
  });

  const onGenerateKeyphrase = useCallback(() => {
    const keyphrase = keyManager.generate();
    const seed = keyManager.toSeed(keyphrase);
    console.log(`🚀 ~ onGenerate ~ keyphrase`, keyphrase)
    console.log(`🚀 ~ onGenerate ~ seed`, seed)
    dispatch({
      type: "CREATE_WALLET/CREATE_KEYPHRASE",
      payload: keyphrase
    });

    

    // setKeyphrase(keyphrase);

    // const isValid = keyManager.validate(keyphrase);
    // console.log(`🚀 ~ onGenerate ~ isValid`, isValid);

    // Create User
    // onCreateUser(keyphrase);
  }, [keyManager]);
  const value = {
    ...state,
    onGenerateKeyphrase,
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
