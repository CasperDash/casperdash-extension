import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import { getPublicKeyAndLoginOptions } from '@cd/selectors/user';

const useWithAccount = () => {
	const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cacheConnectedAccount, setCache] = useState(undefined);
  console.log(`🚀 ~ cacheConnectedAccount`, loading, cacheConnectedAccount)

  const { publicKey: storePublicKey, loginOptions: storeLoginOptions } = useSelector(getPublicKeyAndLoginOptions);
  console.log(`🚀 ~ reduxStore:: `, storePublicKey, storeLoginOptions);

  const loadCache = useCallback(async () => {
    const res = await getConnectedAccountChromeLocalStorage();
    if (!isEqual(res, cacheConnectedAccount)) {
      console.log(`🚀 ~ CACHE:: `, res, cacheConnectedAccount);
      setCache(res);
    }

    setLoading(false);
  }, [cacheConnectedAccount]);

  /** Called once when Component is mounted */
  useEffect(() => {
    setLoading(true);
    loadCache();

    return () => {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * When publicKey and loginOption from redux store changes
   * Update latest data (also reload from local store)
   */
  useEffect(() => {
    if (cacheConnectedAccount && (cacheConnectedAccount.publicKey !== storePublicKey || (cacheConnectedAccount.loginOptions !== storeLoginOptions))) {
      setLoading(true);
      loadCache();
    }
  }, [cacheConnectedAccount, loadCache, storeLoginOptions, storePublicKey])

  useEffect(() => {
    // Skip
    if (!cacheConnectedAccount || loading) {
      console.log("::: SKIP: ", loading)
      return;
    }

    const { publicKey, loginOptions } = cacheConnectedAccount;
    // Redux store empty
    // Cache has User info
    // => navigate to `welcomeBack`
    // userHashingOptions
    if (!publicKey && !isEmpty(loginOptions) && loginOptions.userHashingOptions) {
      console.log("::: WELCOME BACK")
      navigate('/welcomeBack');
      return;
    }

    // Redux store empty
    // Cache empty
    // => navigate to `connectAccount`
    if (!publicKey && isEmpty(storeLoginOptions) && isEmpty(loginOptions)) {
      console.log("::: CONNECT ACC")
      navigate('/connectAccount');
      return;
    }
  }, [loading, navigate, cacheConnectedAccount, storeLoginOptions]);

  return cacheConnectedAccount;
};

export default useWithAccount;
