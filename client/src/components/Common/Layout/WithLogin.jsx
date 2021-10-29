import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getPublicKey } from '../../../selectors/user';

export const WithLoggedIn = ({ children }) => {
	const publicKey = useSelector(getPublicKey);
	const history = useHistory();

	if (!publicKey) {
		const currentPath = window.btoa(JSON.stringify(history.location));
		history.push(`/login?path=${currentPath}`);
		return null;
	}

	return children;
};
