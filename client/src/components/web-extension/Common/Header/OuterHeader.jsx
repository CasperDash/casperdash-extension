import React, { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackArrow from 'assets/image/back-arrow.svg';
import './OuterHeader.scss';
import useCreateWalletStore from "web-extension/CreateWallet/useCreateWallet";
import { generateCWHeader } from "web-extension/CreateWallet/utils";

export const OuterHeader = () => {
  const { answerSheet, currentStep, onResetWalletCreation } = useCreateWalletStore();
	const navigate = useNavigate();
	const { pathname, state } = useLocation();
  const shouldShowBackArrow = pathname !== "/welcomeBack";

  const finalLayoutName = useMemo(() => {
    if (!state?.name) {
      return undefined;
    }

    if (state?.name === "Recovery Phrase") {
      return generateCWHeader(currentStep, answerSheet);
    }
    return state?.name;
  }, [answerSheet, currentStep, state?.name]);

  const onClickBackHandler = useCallback(() => {
    if (currentStep !== 0) {
      onResetWalletCreation();
    }

    navigate(-1);
  }, [currentStep, navigate, onResetWalletCreation]);

  if (!finalLayoutName) {
    return null;
  }

	return (
    <div className="cd_we_outer_header">
      {shouldShowBackArrow && (
        <div className="cd_we_back_btn" onClick={onClickBackHandler}>
          <BackArrow />
        </div>
      )}
      <div className="cd_we_title">{finalLayoutName}</div>
    </div>
	);
};
