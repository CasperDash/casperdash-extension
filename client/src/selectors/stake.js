export const getConfirmedStakesGroupByValidator =
	() =>
	({ stakes = {} }) => {
		if (!stakes.delegations) {
			return [];
		}
		let groupByValidators = [];
		stakes.delegations.forEach((stake) => {
			const { validator, amount, status, entryPoint } = stake;
			const realAmount = 'undelegate' === entryPoint ? -1 * amount : amount;
			const foundValidator = groupByValidators.findIndex((item) => validator === item.validator);
			const amountKey = `${status}Amount`;

			if (foundValidator < 0) {
				const amountObj = {};
				amountObj[amountKey] = realAmount;
				groupByValidators.push({
					validator,
					...amountObj,
				});
				return;
			}

			if (!groupByValidators[foundValidator][amountKey]) {
				groupByValidators[foundValidator][amountKey] = 0 + realAmount;
				return;
			}

			groupByValidators[foundValidator][amountKey] += realAmount;
		});
		return groupByValidators;
	};

export const getPendingStakes =
	() =>
	({ stakes = {} }) => {
		if (!stakes.delegations) {
			return [];
		}

		return stakes.delegations.filter((stake) => stake.status === 'pending').map((stake) => stake.deployHash);
	};
