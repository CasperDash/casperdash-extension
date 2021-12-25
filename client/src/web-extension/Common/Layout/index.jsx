import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBar from 'react-top-loading-bar';
import { fetchPriceHistory } from '../../../actions/priceActions';
import { getLatestBlockHash } from '../../../actions/deployActions';
import { REFRESH_TIME } from '../../../constants/key';
import { isLoadingRequest } from '../../../selectors/request';
import BottomBar from './BottomBar';

const Layout = (props) => {
	const dispatch = useDispatch();
	const ref = useRef(null);

	// Selector
	const isLoading = useSelector(isLoadingRequest);

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
			<BottomBar modules={props.modules} />
			<div className="cd_web_extension_content">{props.children}</div>
		</div>
	);
};

export default Layout;
