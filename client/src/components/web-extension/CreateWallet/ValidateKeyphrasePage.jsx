import React from "react";
import useCreateWalletStore from "./useCreateWallet";

const ValidateKeyphrasePage = () => {
  const { currentStep } = useCreateWalletStore();

  if (currentStep !== 1) {
    return null;
  }

  return (
    <div>
      Validate here
    </div>
  )
};

export default ValidateKeyphrasePage;