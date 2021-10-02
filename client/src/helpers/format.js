export const toFormattedNumber = (num, locales, options) => {
	return new Intl.NumberFormat(locales, options).format(num);
};
