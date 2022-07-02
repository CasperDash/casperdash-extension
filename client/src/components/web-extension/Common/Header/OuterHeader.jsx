import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackArrow from 'assets/image/back-arrow.svg';
import './OuterHeader.scss';
import useCreateWalletStore from "web-extension/CreateWallet/useCreateWallet";

export const OuterHeader = () => {
  const { currentStep } = useCreateWalletStore();
	const navigate = useNavigate();
	const { state } = useLocation();
  const finalLayoutName = useMemo(() => {
    if (!state?.name) {
      return undefined;
    }

    if (state?.name === "Recovery Phrase") {
      switch(currentStep) {
        case 1:
          return "Double Check";
        case 2:
          return "Enter password";
        default:
          return "Recovery Phrase"
      }
    }
    
    return state?.name;
  }, [currentStep, state]);

  if (!finalLayoutName) {
    return null;
  }

	return (
    <div className="cd_we_outer_header">
      <div className="cd_we_back_btn" onClick={() => navigate(-1)}>
        <BackArrow />
      </div>
      <div className="cd_we_title">{finalLayoutName}</div>
    </div>
	);
};
