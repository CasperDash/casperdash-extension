const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Transfer extends Model {
		static associate(models) {
			models.Transfer.Block = models.Transfer.belongsTo(models.Deploy, {
				foreignKey: 'deployHash',
			});
		}

		async toJSON() {
			let block = await this.getDeploy();
			return {
				id: this.id,
				source: this.source,
				target: this.target,
			};
		}
	}

	Transfer.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
			source: DataTypes.STRING,
			target: DataTypes.STRING,
			amount: DataTypes.INTEGER,
			from: DataTypes.STRING,
			gas: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Transfer',
		},
	);

	return Transfer;
};
