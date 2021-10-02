export const toFormattedNumber = (num, locales, options) => {
	return new Intl.NumberFormat(locales, { maximumFractionDigits: 9, ...options }).format(num);
};
