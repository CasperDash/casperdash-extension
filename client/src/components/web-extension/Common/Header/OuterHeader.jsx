import React, { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCreateWalletCurrentStep } from "@cd/selectors/createWallet";
import { resetWalletCreation } from "@cd/actions/createWalletActions";
import BackArrow from '@cd/assets/image/back-arrow.svg';
import './OuterHeader.scss';

export const OuterHeader = ({ setHeader, header }) => {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCreateWalletCurrentStep);
	const navigate = useNavigate();
	const { pathname, state } = useLocation();
  const shouldShowBackArrow = pathname !== "/welcomeBack";

  const finalLayoutName = useMemo(() => {
    if (header && header !== "") {
      return header;
    }

    if (!state?.name) {
      return undefined;
    }

    return state?.name;
  }, [header, state?.name]);

  const onClickBackHandler = useCallback(() => {
    if (currentStep !== 0) {
      dispatch(resetWalletCreation());
      setHeader(undefined);
    }

    navigate(-1);
  }, [currentStep, navigate, dispatch, setHeader]);

  if (!finalLayoutName) {
    return null;
  }

	return (
    <div className="cd_we_outer_header">
      {shouldShowBackArrow && (
        <div data-testid="back-button" className="cd_we_back_btn" onClick={onClickBackHandler}>
          <BackArrow />
        </div>
      )}
      <div className="cd_we_title">{finalLayoutName}</div>
    </div>
	);
};
