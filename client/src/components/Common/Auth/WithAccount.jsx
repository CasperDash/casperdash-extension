import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getPublicKey } from '../../../selectors/user';

const WithAccount = ({ children }) => {
	const publicKey = useSelector(getPublicKey);
	const navigate = useNavigate();

	useEffect(() => {
		if (!publicKey) {
			navigate('/connectAccount');
		}
	}, [publicKey, navigate]);

	return children;
};

export default WithAccount;
