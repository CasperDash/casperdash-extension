import { CLPublicKey } from 'casper-js-sdk';
import { toMotes } from '../helpers/currency';
import { buildTransferDeploy } from './casperServices';
import { request } from './request';

/**
 * It builds a transfer deploy.
 * @param transactionDetail
 * @returns The transfer deploy.
 */
export const getTransferDeploy = (transactionDetail = {}) => {
	try {
		const { fromAddress, toAddress, amount, transferId = 0, fee } = transactionDetail;
		const fromPbKey = CLPublicKey.fromHex(fromAddress);
		const toPbKey = CLPublicKey.fromHex(toAddress);
		return buildTransferDeploy(fromPbKey, toPbKey, toMotes(amount), transferId, fee);
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to build transfer deploy.`);
	}
};


/**
 * Fetch key manager deploy
 * @param {Number} weight
 * @param {String} mainAccount main account public key hex
 * @returns {Object} signed deploy Json
 */
 export const getAccounts = async (publicKeys) => {
	const data = await request('/users', {
		method: 'post',
		data: {
			publicKeys
		}
	});

	return data;
};