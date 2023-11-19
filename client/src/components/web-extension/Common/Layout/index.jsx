import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Outlet } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { fetchPriceHistory, fetchCSPRMarketInfo } from '../../../../actions/priceActions';
import { getLatestBlockHash } from '../../../../actions/deployActions';
import { REFRESH_TIME } from '../../../../constants/key';
import { Header, InnerHeader } from '../Header';
import BottomBar from './BottomBar';
import './index.scss';

const Layout = ({ modules = [] }) => {
	// Hook
	const dispatch = useDispatch();
	const ref = useRef(null);
	const { pathname } = useLocation();

	const [prevRoute, setPrevRoute] = useState();

	const mainModule = useMemo(() => modules.find((module) => module.route === pathname), [modules, pathname]);

	// Effect
	useEffect(() => {
		const refreshStateRootHash = setInterval(() => dispatch(getLatestBlockHash()), REFRESH_TIME);
		return () => clearInterval(refreshStateRootHash);
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchPriceHistory());
		dispatch(fetchCSPRMarketInfo());
	}, [dispatch]);

	return (
		<div className={`cd_all_pages_content`}>
			<LoadingBar ref={ref} color="#53b9ea" height={5} className="loading_indicator" />
			{mainModule ? (
				<Header currentModule={mainModule} />
			) : (
				<InnerHeader prevRoute={prevRoute} setPrevRoute={setPrevRoute} />
			)}
			<div className="cd_web_extension_content">
				<Outlet context={[prevRoute, setPrevRoute]} />
			</div>
			{mainModule && <BottomBar modules={modules} currentModule={mainModule} />}
		</div>
	);
};

export default Layout;
