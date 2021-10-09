const { getDb } = require(__dirname + '/../../../common/db');
const Storage = require(__dirname + '/../../../common/storage');

const getDeployTransactionsByAccount = async (account) => {
	const storage = new Storage(getDb());
	return await storage.getTransactions(account);
};

module.exports = {
	getDeployTransactionsByAccount,
};
