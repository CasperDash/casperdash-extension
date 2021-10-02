console.log('-- Welcome to casper event handler --');
const { EventName, EventStream } = require('casper-js-sdk');
const stream = require('stream');
const { promisify } = require('util');
const got = require('got');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/eh-config.json')[env];

const Storage = require('./storage');
const models = require('../../common/models/index');

if (env === 'production') {
	(async () => {
		models.sequelize.sync({ force: false, logging: false });
	})();
} else if (env === 'development') {
	(async () => {
		models.sequelize.sync({ force: true, logging: false });
	})();
}

class EventHandler {
	constructor() {}

	listener(eventStreamAdress) {
		const es = new EventStream(eventStreamAdress);
		let storage = new Storage(models);
		es.subscribe(EventName.DeployProcessed, async (value) => {
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
	mainEventHandler.listener(mainEventUrl);
};
initEventHandler();

module.exports = EventHandler;
