import React, { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetWalletCreation } from '@cd/actions/createWalletActions';
import BackArrow from '@cd/assets/image/back-arrow.svg';
import './OuterHeader.scss';

export const OuterHeader = ({ setHeader, header }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { pathname, state } = useLocation();
	const shouldShowBackArrow = pathname !== '/welcomeBack' && (pathname === '/createWallet' && currentStep !== 0);

	const finalLayoutName = useMemo(() => {
		if (!state?.name) {
			return undefined;
		}

		if (header && header !== '') {
			return header;
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
