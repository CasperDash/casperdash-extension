const { CLPublicKey } = require('casper-js-sdk');
const { getStateRootHash, casperServiceRPC } = require('./CasperServices');

const getAccountBalanceByUref = async (uref, stateRootHash) => {
	try {
		const rootHash = stateRootHash || (await getStateRootHash());
		const balance = await casperServiceRPC.getAccountBalance(rootHash, uref);
		return balance;
	} catch {
		return 0;
	}
};

const getAccount = async (publicKey, stateRootHash) => {
	try {
		const rootHash = stateRootHash || (await getStateRootHash());
		const publicKeyCL = CLPublicKey.fromHex(publicKey);

		const account = await casperServiceRPC
			.getBlockState(rootHash, publicKeyCL.toAccountHashStr(), [])
			.then((res) => res.Account);

		return account;
	} catch (error) {
		throw error;
	}
};

const getAccountDetails = async (publicKey) => {
	const account = await getAccount(publicKey);
	const balance = await getAccountBalanceByUref(account && account.mainPurse);
	return { ...account, balance };
};

module.exports = {
	getAccount,
	getAccountDetails,
};
