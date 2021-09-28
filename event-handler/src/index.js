console.log('-- Welcome to casper event handler --');
const stream = require('stream');
const { promisify } = require('util');
const got = require('got');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/eh-config.json')[env];

const Storage = require('./storage');
const models = require('../src/models/index');

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

	async createInputStream(url) {
		try {
			const readStream = got.stream(url);
			return readStream;
		} catch (err) {
			if (err instanceof got.stream.RequestError) {
				throw new Error('Connection Failed - check the status of the node:\n' + err);
			} else {
				throw new Error(err);
			}
		}
	}

	async createOutputStream() {
		let outputStream = new stream.Writable();
		// Initialise storage
		let storage = new Storage(models);

		outputStream._write = async (chunk, encoding, done) => {
			// Removes 'data:' prefix from the event to convert it to JSON
			let jsonData;
			try {
				jsonData = JSON.parse(chunk.toString().split('\n')[0].substr(5));

				console.log('JSON Data', jsonData);
				if (jsonData == undefined) {
					throw new Error('Not a json after all');
				}
			} catch (err) {
				done();
				return;
			}

			// Uncomment to get JSON output from event stream to stdout
			// console.log(jsonData);

			if (jsonData.DeployProcessed) {
				await storage.onDeployProccessed(jsonData.DeployProcessed);
				console.log('\nSaved Processed Deploys...'); // For debugging
			} else if (jsonData.DeployAccepted) {
				await storage.onDeployAccepted(jsonData.DeployAccepted);
				console.log('\nSaved Accepted Deploys...'); // For debugging
			} else if (jsonData.BlockAdded) {
				await storage.onBlockAdded(jsonData.BlockAdded);
			}

			done();
		};

		return outputStream;
	}

	/**
	 * Attempts to create a streaming pipeline given an input and output stream.
	 *
	 * @param {stream.Readable} inputStream
	 * @param {stream.Writable} outputStream
	 */
	async createPipeline(inputStream, outputStream) {
		// initialise pipeline
		const pipeline = promisify(stream.pipeline);

		try {
			await pipeline(inputStream, outputStream);
		} catch (err) {
			console.error(err);
		}
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
	const mainEventUrl = await mainEventHandler.formURL();
	const mainEventStream = await mainEventHandler.createInputStream(mainEventUrl);
	const storageMainStream = await mainEventHandler.createOutputStream();
	mainEventHandler.createPipeline(mainEventStream, storageMainStream);

	const deployEventHandler = new EventHandler();
	const deployEventUrl = await deployEventHandler.formURL(undefined, undefined, undefined, 'events/deploys');
	const deployEventStream = await deployEventHandler.createInputStream(deployEventUrl);
	const storageDeployStream = await deployEventHandler.createOutputStream();
	deployEventHandler.createPipeline(deployEventStream, storageDeployStream);
};
initEventHandler();

module.exports = EventHandler;
