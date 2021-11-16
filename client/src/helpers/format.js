export const toFormattedNumber = (num, locales, options) => {
	return new Intl.NumberFormat(locales, { maximumFractionDigits: 9, ...options }).format(num);
};

export const toFormattedCurrency = (num, locales, options) => {
	const defaultOpt = {
		style: 'currency',
		currency: 'USD',
	};
	return new Intl.NumberFormat(locales, { ...defaultOpt, ...options }).format(num);
};

export const toFormattedDate = (
	dateString,
	locales,
	options = { dateStyle: 'short', timeStyle: 'medium', hour12: false },
) => {
	let date;
	try {
		date = new Date(dateString);
	} catch (error) {
		date = new Date();
	}
	return new Intl.DateTimeFormat(locales, options).format(date);
};

export const displayNaN = (value) => {
	return Number.isNaN(value) || 'NaN' === value ? '-' : value;
};
