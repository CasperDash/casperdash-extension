/**
 * Return formatted number.
 * @param {Number} num - Number.
 * @param {String} locales - Locales.
 * @param {Object} options - Format options.
 * @return {String} Formatted number.
 */
export const toFormattedNumber = (num, locales, options) => {
	return new Intl.NumberFormat(locales, { maximumFractionDigits: 9, ...options }).format(num);
};

/**
 * Return formatted number by currency.
 * @param {Number} num - Number.
 * @param {String} locales - Locales.
 * @param {Object} options - Format options.
 * @return {String} Formatted number by currency.
 */
export const toFormattedCurrency = (num, locales, options) => {
	const defaultOpt = {
		style: 'currency',
		currency: 'USD',
	};
	return new Intl.NumberFormat(locales, { ...defaultOpt, ...options }).format(num);
};

/**
 * Return formatted date.
 * @param {String} dateString - Date.
 * @param {String} locales - Locales.
 * @param {Object} options - Format options.
 * @return {String} Formatted date.
 */
export const toFormattedDate = (
	dateString,
	locales,
	options = { dateStyle: 'short', timeStyle: 'medium', hour12: false },
) => {
	let date;
	try {
		date = new Date(dateString);
	} catch {
		date = new Date();
	}

	return new Intl.DateTimeFormat(locales, options).format(date);
};
