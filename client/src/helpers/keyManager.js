export const getWeightByAccountHash = (accountHash = '', associatedKeys = []) => {
	const associatedKey = associatedKeys.find((key) => key.accountHash === accountHash);
	if (associatedKey) {
		return associatedKey.weight;
	}
	return '-';
};
