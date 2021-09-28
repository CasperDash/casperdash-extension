class Storage {
	constructor(models, pubsub = null) {
		this.models = models;
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
		const { deploy_hash: deployHash, account, execution_result } = event;
		let cost = 0;
		let error_message = '';
		if (execution_result.Success) {
			cost = execution_result.Success.cost;
		} else if (execution_result.Failure) {
			const failture = execution_result.Failure;
			cost = failture.cost;
			error_message = failture.error_message;
		}

		await this.models.Deploy.create({
			deployHash,
			account,
			state: 'processed',
			cost,
		});
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
}

module.exports = Storage;
