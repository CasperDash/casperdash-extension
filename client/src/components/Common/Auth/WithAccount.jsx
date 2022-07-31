import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions';
import { getPublicKey } from '@cd/selectors/user';

const WithAccount = ({ children }) => {
  const [cacheConnectedAccount, setCache] = useState(undefined);

	// Hook
  /**
   * publicKey is cleared after closing extension (Clicking on CD extension icon)
   * We should store this somewhere else
   */
	const publicKey = useSelector(getPublicKey);
	const navigate = useNavigate();
	const dispatch = useDispatch();

  useEffect(() => {
    getConnectedAccountChromeLocalStorage().then(data => setCache(data));
  }, []);

	useEffect(() => {
    /**
     * Navigate to `/welcomeBack` screen when found cached User info
     * Otherwise, redirect back to connect Account screen
     */
    if (!publicKey && cacheConnectedAccount) {
      const { loginOptions: loginOptionsCache } = cacheConnectedAccount;
      if (loginOptionsCache?.userInfo && loginOptionsCache?.userHashingOptions) {
        navigate('/welcomeBack');
        return;
      }

      navigate('/connectAccount');
    }
	}, [publicKey, navigate, dispatch, cacheConnectedAccount]);

	return children;
};

export default WithAccount;
