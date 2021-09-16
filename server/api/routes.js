module.exports = function (app) {
	const userController = require('./controllers/UserController');

	// todoList Routes
	app.route('/users').get(userController.get);

	app.route('/user/:publicKey').get(userController.detail);
	app.route('/user/balanceByUref/:balanceUref').get(userController.balanceByUref);
};
