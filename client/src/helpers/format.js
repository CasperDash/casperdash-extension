import { MOTE_RATE } from '../constants/key';

/**
 * Return formatted number.
 * @param {Number} num - Number.
 * @param {Object} options - Format options.
 * @param {String} locales - Locales.
 * @return {String} Formatted number.
 */
export const toFormattedNumber = (num = 0, options, locales) => {
	const number = new Intl.NumberFormat(locales, { maximumFractionDigits: 5, ...options });
	return number.format(num) || '0';
};

/**
 * Return formatted number by currency.
 * @param {Number} num - Number.
 * @param {Object} options - Format options.
 * @param {String} locales - Locales.
 * @return {String} Formatted number by currency.
 */
export const toFormattedCurrency = (num = 0, options, locales) => {
	const defaultOpt = {
		style: 'currency',
		currency: 'USD',
	};
	return new Intl.NumberFormat(locales, { ...defaultOpt, ...options }).format(num);
};

/**
 * Return formatted date.
 * @param {String} dateString - Date.
 * @param {Object} options - Format options.
 * @param {String} locales - Locales.
 * @return {String} Formatted date.
 */
export const toFormattedDate = (
	dateString,
	options = { dateStyle: 'short', timeStyle: 'medium', hour12: false },
	locales,
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

const toDisplayValueFromMote = (mote, options) => {
	return toFormattedNumber(mote / MOTE_RATE, options);
};

export const getValueByFormat = (value, options) => {
	const { format, ...formatOptions } = options;
	switch (format) {
		case 'currency':
			return toFormattedCurrency(value, formatOptions);
		case 'number':
			return toFormattedNumber(value, formatOptions);
		case 'date':
			return toFormattedDate(value, formatOptions);
		case 'mote':
			return toDisplayValueFromMote(value, options);
		case 'percentage':
			// value store in blockchain is int, the percentage is already multiplied by 100
			return toFormattedNumber(value / 100, {
				style: 'percent',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		default:
			return value;
	}
};
