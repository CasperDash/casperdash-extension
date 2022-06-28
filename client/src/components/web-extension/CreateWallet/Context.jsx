import React, { useReducer, createContext } from "react";
import { initialState, reducer } from "./reducer";

const CreateWalletContext = createContext();

const CreateWalletProvider = props => {
  const { children } = props;
  const [ state, dispatch ] = useReducer(reducer, {
    ...initialState
  });
  const value = {
    ...state,
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
