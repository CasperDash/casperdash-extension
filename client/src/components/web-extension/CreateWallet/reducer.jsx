export const initialState = {
  currentStep: 0,
  totalKeywords: 12,
  totalWordCheck: 8,
  keyPhrase: null,
  keyPhraseAsMap: []
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
        keyPhrase: payload.keyphrase,
        keyPhraseAsMap: payload.map ?? {}
      }
    case "CREATE_WALLET/RESET":
      return initialState;
    case "CREATE_WALLET/GENERATE_VALIDATOR":
      return {
        ...state,
        validator: payload
      }
    default:
      return state;
  }
};
