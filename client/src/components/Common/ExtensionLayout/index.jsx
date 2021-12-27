import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBar from 'react-top-loading-bar';
import { fetchPriceHistory } from '../../../actions/priceActions';
import { getLatestBlockHash } from '../../../actions/deployActions';
import { switchTheme } from '../../../actions/settingActions';
import { REFRESH_TIME } from '../../../constants/key';
import { DARK_THEME, LIGHT_THEME } from '../../../constants/settings';
import { isLoadingRequest } from '../../../selectors/request';
import { getTheme } from '../../../selectors/settings';
import BottomBar from './BottomBar';

const Layout = (props) => {
	const dispatch = useDispatch();
	const ref = useRef(null);

	// Selector
	const isLoading = useSelector(isLoadingRequest);
	const theme = useSelector(getTheme);
	// Effect
	useEffect(() => {
		if (theme) {
			const currentTheme = theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
			document.body.classList.remove(currentTheme);
			document.body.classList.add(theme);
		}
	}, [theme]);

	useEffect(() => {
		const refreshStateRootHash = setInterval(() => dispatch(getLatestBlockHash()), REFRESH_TIME);
		return () => clearInterval(refreshStateRootHash);
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchPriceHistory());
	}, [dispatch]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const localTheme = localStorage.getItem('themColor') || DARK_THEME;
			dispatch(switchTheme(localTheme));
		}
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
			<BottomBar modules={props.modules} />
			<div className="cd_all_pages_inner_content">{props.children}</div>
		</div>
	);
};

export default Layout;
