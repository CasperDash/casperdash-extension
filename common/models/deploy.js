const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Deploy extends Model {
		async toJSON() {
			return {
				deployHash: this.deployHash,
				account: this.account,
				state: this.state,
				cost: this.cost,
				errorMessage: this.errorMessage,
				blockHash: this.blockHash,
			};
		}
	}

	Deploy.init(
		{
			deployHash: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			account: DataTypes.STRING,
			state: DataTypes.STRING,
			cost: DataTypes.INTEGER,
			errorMessage: DataTypes.STRING,
			blockHash: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Deploy',
		},
	);

	return Deploy;
};
