import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getLocalStorageValue } from "@cd/services/localStorage";
import { getConnectedAccountFromLocalStorage } from '../../../actions/userActions';
import { getPublicKey } from '../../../selectors/user';

const WithAccount = ({ children }) => {
	// Hook
	const publicKey = useSelector(getPublicKey);
  console.log(`🚀 ~ WithAccount ~ publicKey`, publicKey)
	const navigate = useNavigate();
	const dispatch = useDispatch();

  /**
   * Navigate to `/welcomeBack` screen when found cached User info
   */
	useEffect(() => {
		if (!publicKey && !dispatch(getConnectedAccountFromLocalStorage())) {
			navigate('/connectAccount');
		}
	}, [publicKey, navigate, dispatch]);

	return children;
};

export default WithAccount;
