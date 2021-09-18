const { getAccount } = require('./UserService');

const getKeyManagerInfoByPublicKey = async (publicKey) => {
	if (!publicKey) {
		throw Error('No public Key');
	}

	const account = await getAccount(publicKey);
	return account;
};

module.exports = {
	getKeyManagerInfoByPublicKey: getKeyManagerInfoByPublicKey,
};
