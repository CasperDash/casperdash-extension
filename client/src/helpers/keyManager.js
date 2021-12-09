/**
 * Get account weight by hash.
 * @param {String} accountHash - Account hash.
 * @param {Array} associatedKeys - List of associated keys.
 * @return {Number} Weight.
 */
export const getWeightByAccountHash = (accountHash = '', associatedKeys = []) => {
	const associatedKey = associatedKeys.find((key) => key.accountHash === accountHash);
	if (associatedKey) {
		return associatedKey.weight;
	}
	return '';
};
