import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getPublicKey } from '../../../selectors/user';

export const WithLoggedIn = ({ children }) => {
	const publicKey = useSelector(getPublicKey);
	const history = useHistory();
	if (!publicKey) {
		history.push('/');
		return null;
	}

	return children;
};
