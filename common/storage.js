class Storage {
	constructor(db, pubsub = null) {
		this.db = db;
		this.pubsub = pubsub;
	}

	/**
	 * Store the proccessed deploys to MongoDB
	 *
	 * @param {DeployObject} event
	 */
	async onDeployProccessed(event) {
		console.log('On deployed', event);
		const { deploy_hash: deployHash, block_hash: blockHash, account, execution_result } = event;
		let cost = 0;
		let errorMessage = '';
		if (execution_result.Success) {
			cost = execution_result.Success.cost;
		} else if (execution_result.Failure) {
			const failure = execution_result.Failure;
			cost = failure.cost;
			errorMessage = failure.error_message;
			console.log('Error mess', errorMessage);
		}

		await this.db.collection('deploys').insertOne(event);
	}

	/**
	 * Query transactions deploy
	 *
	 * @param {String} account Main account public key
	 * @returns
	 */
	async getTransactions(account) {
		return await this.db
			.collection('deploys')
			.find({
				$and: [
					{
						account: {
							$eq: account,
						},
					},
					{ 'execution_result.Success.transfers': { $exists: true } },
				],
			})
			.toArray();
	}
}

module.exports = Storage;
