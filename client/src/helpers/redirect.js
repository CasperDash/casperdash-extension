import { EXPLORER_URL } from '../constants/key';

/**
 * Open new window to block explorer.
 * @param {Object}  - Destination Object.
 * @return {void}
 */
export const viewInExplorer = ({ type, value }) => {
	const url = `${EXPLORER_URL}/${type}/${value}`;
	window.open(url, '_blank');
};
