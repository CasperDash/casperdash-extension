import { request } from './request';

export const getKeyManagerData = async (publicKey) => {
	if (!publicKey) {
		return {};
	}

	const data = await request(`keyManager/${publicKey}`);

	return data;
};
