import React from "react";
import { Button } from 'react-bootstrap';
import useCreateWalletStore from "./useCreateWallet";

const RecoveryPhrasePage = () => {
  const { currentStep, setNextStep } = useCreateWalletStore();
  return (
    <div>
      <div className="cd_we_input_label">
        Testing: {currentStep}
      </div>
      <Button onClick={setNextStep}>Next</Button>
    </div>
  )
};

export default RecoveryPhrasePage;