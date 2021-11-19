import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getPublicKey } from '../../../selectors/user';
import { setRedirectPath } from '../../../actions/userActions';

export const WithLoggedIn = ({ children }) => {
	const publicKey = useSelector(getPublicKey);
	const history = useHistory();
	const dispatch = useDispatch();

	if (!publicKey) {
		const currentPath = window.btoa(JSON.stringify(history.location));
		dispatch(setRedirectPath(currentPath));
		history.push('/login');
		return null;
	}

	return children;
};
