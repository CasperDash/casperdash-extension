const { MongoClient } = require('mongodb');

const env = process.env.NODE_ENV || 'development';
let _db;
const initDb = async (connectionString, dbName) => {
	let client;
	if ('production' === env) {
		client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
		await client.connect();
		console.log('Connected succesfully to mongodb');
	} else if ('development' === env) {
		client = new MongoClient(connectionString);
		await client.connect();
		console.log('Connected succesfully to local mongodb');
	}

	_db = client.db(dbName);
	return _db;
};

const getDb = () => {
	return _db;
};

module.exports = {
	initDb,
	getDb,
};
