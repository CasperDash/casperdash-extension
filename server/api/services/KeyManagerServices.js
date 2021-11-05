const { getAccount } = require('./UserService');
const { getDeployJson, putDeploy } = require('./CasperServices');

const KEY_MANAGER_CONTRACT_DEPLOY_HASH = 'ec7b24c2059781d465120968957a1c20aa192eacf2e3ff7330a8a94007a3ac6a';

const getKeyManagerInfoByPublicKey = async (publicKey) => {
	if (!publicKey) {
		throw Error('No public Key');
	}

	const account = await getAccount(publicKey);
	return account;
};

const getKeyManagerDeploy = async () => {
	const session = await getDeployJson(KEY_MANAGER_CONTRACT_DEPLOY_HASH);
	return session;
};

const deployKeyManagerContract = async (signedDeploy) => {
	const keyManagerDeploy = await getKeyManagerDeploy();
	const deployJson = { deploy: { ...signedDeploy.deploy, session: keyManagerDeploy.deploy.session } };
	const hash = await putDeploy(deployJson);
	return hash;
};

module.exports = {
	getKeyManagerInfoByPublicKey: getKeyManagerInfoByPublicKey,
	getKeyManagerDeploy,
	deployKeyManagerContract,
};
