export const initialState = {
  currentStep: 0,
  keyPhrase: null
};

export const reducer = (state = initialState, { type }) => {
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
    default:
      return state;
  }
};
