module.exports = function (app) {
	const configController = require('./controllers/ConfigurationController');
	const userController = require('./controllers/UserController');
	const keyManagerController = require('./controllers/KeyManagerController');
	const deployController = require('./controllers/DeployController');
	const tokenController = require('./controllers/TokenController');
	// Configuration
	app.route('/configuration').get(configController.get);
	// User
	app.route('/user/:publicKey').get(userController.get);
	// Key Manager
	app.route('/keyManager/:publicKey').get(keyManagerController.get);
	app.route('/getKeysManagerDeploy').get(keyManagerController.getKeyManagerContractDeploy);
	app.route('/deployKeyManagerContract').post(keyManagerController.deployKeyManagerContract);
	// Deploy
	app.route('/deploy').post(deployController.deploy);
	app.route('/deploysStatus').get(deployController.getDeploysStatus);
	app.route('/getLatestBlockHash').get(deployController.getLatestBlockHash);
	//Token
	app.route('/tokens/getTokensInfo').get(tokenController.getTokens);
	app.route('/token/:tokenAddress').get(tokenController.getToken);
};
