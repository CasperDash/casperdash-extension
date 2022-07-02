export const initialState = {
  currentStep: 0,
  keyPhrase: null
};

export const reducer = (state = initialState, { payload, type }) => {
  switch (type) {
    case "CREATE_WALLET/NEXT_STEP":
      return {
        ...state,
        currentStep: state.currentStep + 1
      }
    case "CREATE_WALLET/PREVIOUS_STEP":
      return {
        ...state,
        currentStep: state.currentStep - 1
      }
    case "CREATE_WALLET/RESET_STEP":
      return {
        ...state,
        currentStep: 0
      }
    case "CREATE_WALLET/CREATE_KEYPHRASE":
      return {
        ...state,
        keyPhrase: payload
      }
    case "CREATE_WALLET/CLEAR_KEYPHRASE":
      return {
        ...state,
        keyPhrase: null
      }
    default:
      return state;
  }
};
