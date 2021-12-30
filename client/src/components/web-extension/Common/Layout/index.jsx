import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Outlet } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { fetchPriceHistory } from '../../../../actions/priceActions';
import { getLatestBlockHash } from '../../../../actions/deployActions';
import { REFRESH_TIME } from '../../../../constants/key';
import { isLoadingRequest } from '../../../../selectors/request';
import { Header, InnerHeader } from '../Header';
import BottomBar from './BottomBar';
import './index.scss';

const Layout = (props) => {
	// Hook
	const dispatch = useDispatch();
	const ref = useRef(null);
	const location = useLocation();

	// Selector
	const isLoading = useSelector(isLoadingRequest);
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
			<div className="cd_web_extension_content">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
