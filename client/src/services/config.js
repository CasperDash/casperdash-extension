import { request } from './request';

export const getConfiguration = async () => {
	const data = await request(`configuration`);
	return data;
};
