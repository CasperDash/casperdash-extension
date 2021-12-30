/**
 * Return formatted number.
 * @param {Number} num - Number.
 * @param {String} locales - Locales.
 * @param {Object} options - Format options.
 * @return {String} Formatted number.
 */
export const toFormattedNumber = (num, locales, options) => {
	const number = new Intl.NumberFormat(locales, { maximumFractionDigits: 9, ...options });
	return number ? number.format(num) : '0';
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
	let date = new Date(dateString);

	if (!(date instanceof Date)) {
		date = new Date();
	}
	return new Intl.DateTimeFormat(locales, options).format(date);
};

export const displayNaN = (value) => {
	return Number.isNaN(value) || 'NaN' === value ? '-' : value;
};

/**
 * Get end string by number or regex
 * @param {string} fullString
 * @param {number} end
 */
export const getEndString = (fullString, end) => {
	if (typeof fullString !== 'string') {
		return fullString;
	}
	if (typeof end === 'string') {
		return end;
	} else if (typeof end === 'number') {
		return fullString.slice(-Math.abs(end));
	} else if (end instanceof window.RegExp) {
		const match = fullString.match(end);
		if (!match) {
			return '';
		}
		const index = match.index;
		return fullString.slice(index);
	}
};
