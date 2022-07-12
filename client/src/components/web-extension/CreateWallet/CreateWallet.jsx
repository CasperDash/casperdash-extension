import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import RecoveryPhrasePage from "./RecoveryPhrasePage";
import ValidateKeyphrasePage from "./ValidateKeyphrasePage";
import CreatePasswordPage from "./CreatePasswordPage";
import useCreateWalletStore from "./useCreateWallet";
import "./CreateWallet.scss";

const CreateWallet = () => {
  const { currentStep } = useCreateWalletStore();

  return (
    <section className="cd_we_page--root">
      {currentStep === 0 && <RecoveryPhrasePage />}
      {/* {currentStep === 1 && <CreatePasswordPage />} */}
      {currentStep === 1 && <ValidateKeyphrasePage />}
      {currentStep === 2 && <CreatePasswordPage />}
    </section>
	);
};

export default compose(
  connect(
    state => {
      console.log(`🚀 ~ state`, state)
      return {}
    }
  )
)(CreateWallet);
