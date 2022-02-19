import IdentIcon from 'identicon.js';

/**
 * It takes a string and returns a base64 encoded SVG image
 * @param value - The address you want to generate an icon for.
 * @param [options] - {
 * @returns A base64 encoded SVG image.
 */
export const getBase64IdentIcon = (value, options = {}) => {
	try {
		return `data:image/svg+xml;base64,${new IdentIcon(value, {
			background: [255, 0, 0, 0],
			format: 'svg',
			...options,
		}).toString()}`;
	} catch {
		return '/assets/images/token-icon.png';
	}
};
