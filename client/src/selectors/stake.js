export const getConfirmedStakesGroupByValidator =
	() =>
	({ stakes = {} }) => {
		if (stakes.stakes) {
			let groupByValidators = [];
			stakes.stakes.forEach((stake) => {
				const { validator, amount, status } = stake;
				if ('success' !== status) {
					return;
				}
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

export const getPendingStakes =
	() =>
	({ stakes = {} }) => {
		if (!stakes.stakes) {
			return stakes;
		}

		return stakes.stakes.filter((stake) => stake.status !== 'success').map((stake) => stake.deployHash);
	};
