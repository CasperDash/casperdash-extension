import { fetchNews } from '@cd/actions/newsActions';
import { getNews } from '@cd/selectors/news';
import React, { useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useDispatch, useSelector } from 'react-redux';

export const News = () => {
	const dispatch = useDispatch();

	// Selector
	const news = useSelector(getNews);

	// Effect
	useEffect(() => {
		dispatch(fetchNews());
	}, [dispatch]);

	const onClick = (url) => {
		if (url) window.open(url, '_blank');
	};

	return news?.length ? (
		<Carousel className="cd_we_news" variant="dark" controls={false}>
			{news?.map(({ label, title, url, bannerUrl }) => (
				<Carousel.Item key={title}>
					<div className="cd_we_news" onClick={() => onClick(url)}>
						<img
							src={bannerUrl}
							alt="news"
							style={{ width: '100%', height: '200px', objectFit: 'contain' }}
						/>
						<div className="cd_we_news_content">
							<div className="badge">{label}</div>
							<div className="content">{title}</div>
						</div>
					</div>
				</Carousel.Item>
			))}
		</Carousel>
	) : null;
};
