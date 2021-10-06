const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3001;
const dbConfig = require(__dirname + '/../common/config/db-config.json')[env];
const { url, dbName } = dbConfig;
const { initDb } = require(__dirname + '/../common/db');

initDb(url, dbName)
	.then(() => {
		var allowCrossDomain = function (req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		};
		app.use(allowCrossDomain);

		app.options('*', cors());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());

		let routes = require('./api/routes'); //importing route
		routes(app);

		app.use(function (req, res) {
			res.status(404).send({ url: req.originalUrl + ' not found' });
		});

		if ('development' === env) {
			app.listen(port);
		}

		console.log('RESTful API server started on: ' + port);
	})
	.catch((error) => {
		console.error('Cannot connect to mongodb', error);
	});

module.exports = app;
