import React from "react";
import { useSelector } from 'react-redux';
import { selectCreateWalletCurrentStep } from "@cd/selectors/createWallet";
import RecoveryPhrasePage from "./RecoveryPhrasePage";
import ValidateKeyphrasePage from "./ValidateKeyphrasePage";
import CreatePasswordPage from "./CreatePasswordPage";
import "./CreateWallet.scss";

const CreateWallet = () => {
  const currentStep = useSelector(selectCreateWalletCurrentStep);

  return (
    <section className="cd_we_page--root">
      {currentStep === 0 && <RecoveryPhrasePage />}
      {currentStep === 1 && <ValidateKeyphrasePage />}
      {currentStep === 2 && <CreatePasswordPage />}
    </section>
	);
};

export default CreateWallet;
