/**
 * Open new window to block explorer.
 * @param {Object}  - Destination Object.
 * @return {void}
 */
export const viewInExplorer = ({ type, value, explorerUrl }) => {
	const url = `${explorerUrl}/${type}/${value}`;
	window.open(url, '_blank');
};
