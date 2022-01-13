import axios from 'axios';
import APP_CONFIGS from '../config';
const baseUrl = APP_CONFIGS.API_ROOT;
const DEFAULT_OPTIONS = {
	mode: 'no-cors', // no-cors, *cors, same-origin
	cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
};
const requester = axios.create({
	baseUrl,
	timeout: 20000,
	...DEFAULT_OPTIONS,
});

export const request = async (options) => {
	const response = await requester(`${baseUrl}${options}`);
	return response.data;
};
