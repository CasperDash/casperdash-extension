import { EXPLORER_URL } from '../constants/key';

export const viewInExplorer = ({ type, value }) => {
	const url = `${EXPLORER_URL}/${type}/${value}`;
	window.open(url, '_blank');
};
