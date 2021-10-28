import Qs from 'qs';

export const getCurrentQuery = (options) => {
	return Qs.parse(window.location.search && window.location.search.substring(1), options) || {};
};
