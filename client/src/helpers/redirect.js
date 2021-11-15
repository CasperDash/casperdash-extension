const EXPLORER_URL = 'https://testnet.cspr.live';

export const viewInExplorer = ({ type, value }) => {
	const url = `${EXPLORER_URL}/${type}/${value}`;
	window.open(url, '_blank');
};
