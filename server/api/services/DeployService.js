const models = require('../../../common/models/index');

const getDeploysByAccount = async (account) => {
	return await models.Deploy.findAll({
		where: {
			account,
		},
	});
};

module.exports = {
	getDeploysByAccount,
};
