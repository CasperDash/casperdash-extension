export const getStakeDeploysGroupByValidator =
	() =>
	({ stakes = {} }) => {
		if (stakes.stakes) {
			let groupByValidators = [];
			stakes.stakes.forEach((stake) => {
				const { validator, amount } = stake;
				const foundValidator = groupByValidators.findIndex((item) => validator === item.validator);
				if (foundValidator < 0) {
					groupByValidators.push({
						validator,
						amount,
					});
				} else {
					groupByValidators[foundValidator].amount += amount;
				}
			});
			return groupByValidators;
		}
		return stakes;
	};
