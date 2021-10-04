import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrizeHistory } from '../../../actions/priceActions';
import { getLatestBlockHash } from '../../../actions/deployActions';
import { REFRESH_TIME } from '../../../constants/key';
import SideBar from '../SideBar';
import { isLoadingRequest } from '../../../selectors/request';
import LoadingBar from 'react-top-loading-bar';

const Layout = (props) => {
	const dispatch = useDispatch();
	const ref = useRef(null);
	// State
	const [color, setColor] = useState('cd_light_theme_active');
	const [isShowingLoading, setIsShowingLoading] = useState(false);

	// Selector
	const isLoading = useSelector(isLoadingRequest);

	// Effect
	useEffect(() => {
		const refreshStateRootHash = setInterval(() => dispatch(getLatestBlockHash()), REFRESH_TIME);
		return () => clearInterval(refreshStateRootHash);
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchPrizeHistory());
	}, [dispatch]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setColor(localStorage.getItem('themColor'));
		}
	}, []);

	useEffect(() => {
		if (isLoading && !isShowingLoading) {
			setIsShowingLoading(true);
			ref.current.continuousStart();
		} else {
			setIsShowingLoading(false);
			ref.current.complete();
		}
	}, [isLoading]);

	// Function
	const themHandler = (val) => {
		setColor(val ? 'cd_light_theme_active' : 'cd_page_dark_mode');
		if (typeof window !== 'undefined') {
			localStorage.setItem('themColor', val ? 'cd_light_theme_active' : 'cd_page_dark_mode');
		}
	};

	const url = window.location.pathname;
	const title = url.split('/')[1];

	return (
		<div className={`cd_all_pages_content ${color === null ? 'cd_light_theme_active' : color}`}>
			<LoadingBar ref={ref} color="#53b9ea" height={5} />
			<SideBar title={title || 'dashboard'} />
			<div className="cd_all_pages_inner_content">{props.children}</div>
		</div>
	);
};

export default Layout;
