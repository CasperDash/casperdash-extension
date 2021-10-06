console.log('-- Welcome to casper event handler --');
const { EventName, EventStream } = require('casper-js-sdk');
const { MongoClient } = require('mongodb');

const env = process.env.NODE_ENV || 'development';
console.log('Env', env);

const config = require(__dirname + '/../config/eh-config.json')[env];
const dbConfig = require(__dirname + '/../../common/config/db-config.json')[env];

const Storage = require('./storage');

class EventHandler {
	constructor() {}

	listener(eventStreamAdress, db) {
		const es = new EventStream(eventStreamAdress);
		let storage = new Storage(db);
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
	const { url, dbName } = dbConfig;
	let client, db;

	if (env === 'production') {
		client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
		await client.connect();
		console.log('Connected succesfully to mongodb');
	} else if (env === 'development') {
		client = new MongoClient(url);
		await client.connect();
		console.log('Connected succesfully to local mongodb');
	}

	try {
		db = client.db(dbName);
		const mainEventHandler = new EventHandler();
		const mainEventUrl = mainEventHandler.formURL();
		mainEventHandler.listener(mainEventUrl, db);
	} catch (error) {
		console.log('There is an error when connecitng to MongoDB', error);
	}
};
initEventHandler();

module.exports = EventHandler;
