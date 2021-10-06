import { DEPLOY } from '../store/actionTypes';

/**
 *
 * @param {String} publicKey Account public key
 * @returns
 */
export const getTransferDeploys = (account) => ({
	type: DEPLOY.GET_DEPLOY_TRANSFERS,
	request: { url: `/getTrans/${account}` },
});
