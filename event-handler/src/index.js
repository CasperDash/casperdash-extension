console.log('-- Welcome to casper event handler --');
const { EventName, EventStream } = require('casper-js-sdk');
const { MongoClient } = require('mongodb');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/eh-config.json')[env];
const dbConfig = require(__dirname + '/../config/db-config.json')[env];

const Storage = require('./storage');
let db;

if (env === 'production') {
	(async () => {
		// models.sequelize.sync({ force: false, logging: false });
	})();
} else if (env === 'development') {
	(async () => {})();
}

class EventHandler {
	constructor() {}

	listener(eventStreamAdress, db) {
		const es = new EventStream(eventStreamAdress);
		let storage = new Storage(db);
		console.log('After storage');
		es.subscribe(EventName.DeployProcessed, async (value) => {
			console.log('On deploy proccessed');
			await storage.onDeployProccessed(value.body.DeployProcessed);
		});
		es.start();
	}

	formURL(protocol, domain, port, path) {
		// Set defaults if args not passed
		this.protocol = protocol !== undefined ? protocol : config.EH_STREAM_PROTOCOL;
		this.domain = domain !== undefined ? domain : config.EH_STREAM_DOMAIN;
		this.port = port !== undefined ? port : config.EH_STREAM_PORT;
		this.path = path !== undefined ? path : config.EH_STREAM_PATH;

		return (
			this.protocol +
			'://' +
			this.domain +
			(this.port ? ':' + this.port : '') +
			(this.path ? '/' + this.path : '')
		);
	}
}

initEventHandler = async () => {
	const mainEventHandler = new EventHandler();
	const mainEventUrl = mainEventHandler.formURL();

	// const { url, dbName } = dbConfig;
	// const client = new MongoClient(url);
	// await client.connect();
	// console.log('Connedted succesfully to mongodb');
	// db = client.db(dbName);

	mainEventHandler.listener(mainEventUrl, {});
};
initEventHandler();

module.exports = EventHandler;
