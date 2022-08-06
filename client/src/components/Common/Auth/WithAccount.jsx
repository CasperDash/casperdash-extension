import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isObject from 'lodash-es/isObject';
import isEmpty from 'lodash-es/isEmpty';
import { connect } from "react-redux";
import { getConnectedAccountChromeLocalStorage, getConnectedAccountLocalStorage } from '@cd/actions/userActions';
import { getPublicKey } from '@cd/selectors/user';

const WithAccount = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [cacheConnectedAccount, setCache] = useState(undefined);

	/**
   * With redux-persist implemented,
	 * publicKey stays in extension state as long as User doesn't lock
	 */
	const publicKey = useSelector(getPublicKey);
  console.log(`🚀 ~ file: WithAccount.jsx ~ line 19 ~ WithAccount ~ publicKey`, publicKey)
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
    let active = true;
    console.log(">>> LOAD")
    setLoading(true);
    load();

    return () => { active = false }

    async function load() {
      const res = await getConnectedAccountChromeLocalStorage();
      console.log(`🚀 ~ file: WithAccount.jsx ~ line 28 ~ load ~ res`, res);

      if (!active) { return }
      const final = isEmpty(res) ? undefined : res;
      console.log(`🚀 ~ file: WithAccount.jsx ~ line 34 ~ load ~ final`, final)
      setCache(final);
      setLoading(false);
    };
	}, [publicKey]);

  // useEffect(() => {
  //   if (!publicKey && !isEmpty(cacheConnectedAccount)) {
  //     setCache(undefined);
  //   }
  // }, [cacheConnectedAccount, publicKey]);

  useEffect(() => {
    if (loading) {
      return;
    }
    /**
     * Navigate to `/welcomeBack` screen when found cached User info
     * Otherwise, redirect back to connect Account screen
     */
    console.log(`🚀 ~ >>>: `, publicKey, typeof cacheConnectedAccount, cacheConnectedAccount)
    if (!publicKey) {
      if (cacheConnectedAccount) {
        console.log(`🚀 ~ A: `, isEmpty(cacheConnectedAccount), cacheConnectedAccount)
        const { loginOptions: loginOptionsCache } = cacheConnectedAccount;
        if (loginOptionsCache?.userInfo && loginOptionsCache?.userHashingOptions) {
          navigate('/welcomeBack');
          return;
        }
      }

      navigate('/connectAccount');
    }
  }, [loading, cacheConnectedAccount, navigate, publicKey])

	return children;
};

// export default WithAccount;
export default connect(state => {
  console.log(`🚀 ~ state`, state)
  return state;
})(WithAccount);
