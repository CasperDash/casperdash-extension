import { NEWS } from '../store/actionTypes';

export const fetchNews = () => ({
	type: NEWS.FETCH_NEWS,
	request: {
		url: '/news',
	},
});
