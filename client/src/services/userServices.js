import { CLPublicKey } from 'casper-js-sdk';
import { toMotes } from '../helpers/currency';
import { buildTransferDeploy } from './casperServices';

class User {
  _user;

  constructor() {}

  set instance(user) {
    this._user = user;
  }

  get instance() {
    return this._user ?? undefined;
  }
}

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

export default new User();
