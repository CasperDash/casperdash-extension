import { request } from './request';

export const fetchUserDetails = async (publicKey) => {
	if (!publicKey) {
		return {};
	}
	const data = await request(`user/${publicKey}`);
	return data;
};
