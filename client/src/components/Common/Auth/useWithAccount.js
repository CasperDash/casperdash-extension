import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import { getPublicKey } from '@cd/selectors/user';

const useWithAccount = () => {
  const [loading, setLoading] = useState(false);
  const [cacheConnectedAccount, setCache] = useState(undefined);
  console.log(`🚀 ~ useWithAccount ~ cacheConnectedAccount`, cacheConnectedAccount)

	/**
   * With redux-persist implemented,
	 * publicKey stays in extension state as long as User doesn't lock
	 */
	const publicKey = useSelector(getPublicKey);
	const navigate = useNavigate();

  /**
   * Load cached account info when 
   * Initial phase when extension is loaded,
   * Skip when `cacheConnectedAccount` is no longer undefined
   */
	useEffect(() => {
    if (cacheConnectedAccount || loading) {
      return;
    }

    let active = true;
    load();

    return () => {
      active = false;
    }

    async function load() {
      setLoading(true);
      const res = await getConnectedAccountChromeLocalStorage();

      if (!active) { return }
      const final = isEmpty(res) ? undefined : res;
      setCache(final);
      setLoading(false);
    };
	}, [loading, cacheConnectedAccount, publicKey]);

  /**
   * Determine whether extension would redirect User back
   * to welcomeScreen or connectAccount screen when
   * `cacheConnectedAccount` has info
   */
  useEffect(() => {
    if (loading || !loading && !cacheConnectedAccount) {
      return;
    }
    /**
     * Navigate to `/welcomeBack` screen when found cached User info
     * Otherwise, redirect back to connect Account screen
     */
    if (!publicKey) {
      if (cacheConnectedAccount) {
        const { loginOptions: loginOptionsCache } = cacheConnectedAccount;
        if (loginOptionsCache?.userInfo && loginOptionsCache?.userHashingOptions) {
          navigate('/welcomeBack');
          return;
        }
      }

      navigate('/connectAccount');
      return;
    }
  }, [loading, cacheConnectedAccount, navigate, publicKey]);

  return cacheConnectedAccount;
};

export default useWithAccount;
