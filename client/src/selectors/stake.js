export const getConfirmedStakesGroupByValidator =
	() =>
	({ stakes = {} }) => {
		if (stakes.delegations) {
			let groupByValidators = [];
			stakes.delegations.forEach((stake) => {
				const { validator, amount, status } = stake;
				const foundValidator = groupByValidators.findIndex((item) => validator === item.validator);
				const amountKey = `${status}Amount`;
				if (foundValidator < 0) {
					const amountObj = {};
					amountObj[amountKey] = amount;
					groupByValidators.push({
						validator,
						...amountObj,
					});
				} else {
					if (!groupByValidators[foundValidator][amountKey]) {
						groupByValidators[foundValidator][amountKey] = 0 + amount;
					} else {
						groupByValidators[foundValidator][amountKey] += amount;
					}
				}
			});
			return groupByValidators;
		}
		return [];
	};

export const getPendingStakes =
	() =>
	({ stakes = {} }) => {
		if (!stakes.delegations) {
			return [];
		}

		return stakes.delegations.filter((stake) => stake.status === 'pending');
	};
