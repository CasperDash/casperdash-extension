class Storage {
	constructor(db, pubsub = null) {
		this.db = db;
		this.pubsub = pubsub;
	}

	async onBlockAdded(event) {
		const { block } = event;
		const { header: blockHeader, body: blockBody } = block;
		const { height } = blockHeader;
		let existingBlock = await this.models.Block.findOne({
			where: { blockHeight: height },
		});
		if (existingBlock !== null) {
			// logs msg
			console.warn('\n\tWARN: event is a duplicate of existing block at height: ' + event.height);
			console.warn('\tThis may cause problems in subsequent events\n');
			return;
		}

		const { timestamp, era_id: eraId } = blockHeader;
		const { proposer, deploy_hashes: deploys } = blockBody;
		const { hash: blockHash } = block;
		const result = await this.models.Block.create(
			{
				blockHeight: height,
				blockHash,
				timestamp,
				eraId,
				proposer,
				state: 'BlockAdded',
				Deploys: deploys.map((deployHash) => {
					return {
						deployHash: deployHash,
						state: 'BlockAdded',
					};
				}),
			},
			{
				include: [this.models.Block.Deploys],
			},
		);
		console.log('Result', result);
	}

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

	async onDeployAccepted(event) {
		const { hash: deployHash, header } = event;
		const { account, gas_price: cost } = header;
		await this.models.Deploy.create({
			deployHash,
			account,
			state: 'accepted',
			cost,
		});
	}

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
