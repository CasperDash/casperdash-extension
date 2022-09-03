import React from "react";
import { useSelector } from 'react-redux';
import { selectCreateWalletCurrentStep } from "@cd/selectors/createWallet";
import CreatePasswordPage from '@cd/web-extension/Common/CreatePasswordPage';
import ImportWalletPage from "./ImportWalletPage";

import './ImportWallet.scss';

const ImportWallet = () => {
  const currentStep = useSelector(selectCreateWalletCurrentStep);
  return (
    <section className="cd_we_page--root">
      {currentStep === 0 && <ImportWalletPage />}
      {currentStep === 1 && <CreatePasswordPage />}
    </section>
	);
};

export default ImportWallet;
