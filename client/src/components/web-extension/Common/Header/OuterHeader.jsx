import React, { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetWalletCreation } from '@cd/actions/createWalletActions';
import BackArrow from '@cd/assets/image/back-arrow.svg';
import './OuterHeader.scss';
import { selectCreateWalletCurrentStep } from '@cd/selectors/createWallet';

const DISALLOWED_PATH_NAMES = ['/connectAccount'];

export const OuterHeader = ({ setHeader, header }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const currentStep = useSelector(selectCreateWalletCurrentStep);
	const { pathname, state } = useLocation();
	const shouldShowBackArrow = pathname !== '/welcomeBack' && (pathname !== '/createWallet' || pathname === '/createWallet' && currentStep !== 0);

	const finalLayoutName = useMemo(() => {
		if (header && header !== '') {
			return header;
		}

		if (!state?.name) {
			return undefined;
		}

		return state?.name;
	}, [header, state]);

	const onClickBackHandler = useCallback(() => {
		dispatch(resetWalletCreation());
		setHeader(undefined);

		navigate(-1);
	}, [navigate, dispatch, setHeader]);

	if (!finalLayoutName) {
		return null;
	}

	if (DISALLOWED_PATH_NAMES.includes(pathname)){
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
