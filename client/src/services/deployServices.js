import { request } from './request';

/**
 *
 * @param {String} publicKey Account public key
 * @returns
 */
export const getDeployTransfers = async (account) => {
	return await request(`/getDeploys/${account}`);
};
