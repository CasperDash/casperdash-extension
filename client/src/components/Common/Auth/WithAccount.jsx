import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getConnectedAccountFromLocalStorage } from '../../../actions/userActions';
import { getPublicKey } from '../../../selectors/user';

const WithAccount = ({ children }) => {
	// Hook
	const publicKey = useSelector(getPublicKey);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!publicKey && !dispatch(getConnectedAccountFromLocalStorage())) {
			navigate('/connectAccount');
		}
	}, [publicKey, navigate, dispatch]);

	return children;
};

export default WithAccount;
