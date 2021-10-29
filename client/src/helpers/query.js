import Qs from 'qs';

export const parseQuery = (query) => {
	return Qs.parse(query);
};

export const getCurrentQuery = (options) => {
	return parseQuery(window.location.search && window.location.search.substring(1), options) || {};
};
