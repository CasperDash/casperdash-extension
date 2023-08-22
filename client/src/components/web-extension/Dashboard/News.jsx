import { fetchNews } from '@cd/actions/newsActions';
import { getNews } from '@cd/selectors/news';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tooltip';

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
		<div className="cd_news_section">
			<Carousel controls={false} indicators={false}>
				{news?.map(({ label, title, url }) => (
					<Carousel.Item key={title}>
						<div
							className="cd_we_news_item"
							onClick={() => onClick(url)}
							data-tooltip-id="news-tooltip"
							data-tooltip-content={title}
						>
							<div className="badge">{label}</div>
							<div className="content">{title}</div>
						</div>
					</Carousel.Item>
				))}
			</Carousel>
			<Tooltip id="news-tooltip" className="cd_news_tooltip" />
			<Link to={'/market'}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					className="cd_more_button bi bi-list"
					viewBox="0 0 16 16"
					data-tooltip-id="more-news-tooltip"
					data-tooltip-content="View more"
				>
					<path
						fillRule="evenodd"
						d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
					/>
				</svg>
			</Link>
			<Tooltip id="more-news-tooltip" />
		</div>
	) : null;
};
