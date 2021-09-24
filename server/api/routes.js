module.exports = function (app) {
	const configController = require('./controllers/ConfigurationController');
	const userController = require('./controllers/UserController');
	const keyManagerController = require('./controllers/KeyManagerController');
	const deployController = require('./controllers/DeployController');
	// Configuration
	app.route('/configuration').get(configController.get);
	// User
	app.route('/user/:publicKey').get(userController.get);
	// Key Manager
	app.route('/keyManager/:publicKey').get(keyManagerController.get);
	app.route('/getKeyManagerDeploySession').get(keyManagerController.getKeyManagerContractDeploySession);
	app.route('/deployKeyManagerContract').post(keyManagerController.deployKeyManagerContract);
	// Deploy
	app.route('/deploy').post(deployController.deploy);
};
