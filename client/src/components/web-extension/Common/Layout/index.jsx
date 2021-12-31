import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
// import { useAutoRefreshEffect } from '../../../hooks/useAutoRefreshEffect';
// import { fetchTokensInfoWithBalance } from '../../../../actions/tokensActions';
// import { getTokensAddressList } from '../../../../selectors/tokens';
// import { getPublicKey } from '../../../../selectors/user';
import { fetchPriceHistory } from '../../../../actions/priceActions';
import { getLatestBlockHash } from '../../../../actions/deployActions';
import { REFRESH_TIME } from '../../../../constants/key';
import { isLoadingRequest } from '../../../../selectors/request';
import { Header, InnerHeader } from '../Header';
import BottomBar from './BottomBar';

const Layout = (props) => {
	const dispatch = useDispatch();
	const ref = useRef(null);
	const location = useLocation();

	// Selector
	const isLoading = useSelector(isLoadingRequest);
	// const tokensAddressList = useSelector(getTokensAddressList);
	// const publicKey = useSelector(getPublicKey);

	// Effect
	useEffect(() => {
		const refreshStateRootHash = setInterval(() => dispatch(getLatestBlockHash()), REFRESH_TIME);
		return () => clearInterval(refreshStateRootHash);
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchPriceHistory());
	}, [dispatch]);

	useEffect(() => {
		if (isLoading) {
			ref.current.continuousStart();
		} else {
			ref.current.complete();
		}
	}, [isLoading]);

	// Effect
	// useAutoRefreshEffect(() => {
	// 	dispatch(fetchTokensInfoWithBalance(tokensAddressList, publicKey));
	// }, [publicKey, JSON.stringify(tokensAddressList)]);

	return (
		<div className={`cd_all_pages_content`}>
			<LoadingBar ref={ref} color="#53b9ea" height={5} className="loading_indicator" />
			{props.modules && props.modules.includes(location.pathname) ? (
				<>
					<Header />
					<BottomBar modules={props.modules} />
				</>
			) : (
				<InnerHeader />
			)}
			<div className="cd_web_extension_content">{props.children}</div>
		</div>
	);
};

export default Layout;
