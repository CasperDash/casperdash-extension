const { getDb } = require(__dirname + '/../../../common/db');
const Storage = require(__dirname + '/../../../common/storage');

const getTransactionsByAccount = async (account) => {
	const storage = new Storage(getDb());
	console.log('Account here', account);
	return await storage.getTransactions(account);
};

module.exports = {
	getTransactionsByAccount,
};
