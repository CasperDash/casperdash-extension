module.exports = function (app) {
	const userController = require('./controllers/UserController');
	const keyManagerController = require('./controllers/KeyManagerController');

	// User
	app.route('/users').get(userController.get);
	app.route('/user/:publicKey').get(userController.detail);
	app.route('/user/balanceByUref/:balanceUref').get(userController.balanceByUref);

	// Key Manager
	app.route('/keyManager/:publicKey').get(keyManagerController.get);
};
