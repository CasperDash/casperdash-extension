import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPrizeHistory } from '../../../actions/priceActions';
import { getLatestBlockHash } from '../../../actions/deployActions';
import { REFRESH_TIME } from '../../../constants/key';
import SideBar from '../SideBar';

const Layout = (props) => {
	const dispatch = useDispatch();
	const [color, setColor] = useState('zl_light_theme_active');

	useEffect(() => {
		const refreshStateRootHash = setInterval(() => dispatch(getLatestBlockHash()), REFRESH_TIME);
		return () => clearInterval(refreshStateRootHash);
	}, dispatch);

	useEffect(() => {
		dispatch(fetchPrizeHistory());
	}, [dispatch]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setColor(localStorage.getItem('themColor'));
		}
	}, []);

	const themHandler = (val) => {
		setColor(val ? 'zl_light_theme_active' : 'zl_page_dark_mode');
		if (typeof window !== 'undefined') {
			localStorage.setItem('themColor', val ? 'zl_light_theme_active' : 'zl_page_dark_mode');
		}
	};

	const url = window.location.pathname;
	const title = url.split('/')[1];

	return (
		<div className={`zl_all_pages_content ${color === null ? 'zl_light_theme_active' : color}`}>
			<SideBar title={title} />
			<div className="zl_all_pages_inner_content">{props.children}</div>
		</div>
	);
};

export default Layout;
