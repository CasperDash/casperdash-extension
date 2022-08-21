import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import { getPublicKeyAndLoginOptions } from '@cd/selectors/user';
import { getActivePublicKey } from '@cd/components/hooks/useServiceWorker';

const useWithAccount = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [cacheConnectedAccount, setCache] = useState(undefined);

	const { publicKey: storePublicKey, loginOptions: storeLoginOptions } = useSelector(getPublicKeyAndLoginOptions);

	const loadCache = useCallback(async () => {
		let publicKey;
		try {
			publicKey = await getActivePublicKey();
		} catch (error) {
			console.error(error);
		}
		console.info(publicKey);
		// const res = await getConnectedAccountChromeLocalStorage();
		if (!isEqual({ publicKey }, cacheConnectedAccount)) {
			setCache({ publicKey });
		}

		setLoading(false);
	}, [cacheConnectedAccount]);

	/**
	 * When publicKey and loginOption from redux store changes
	 * Update latest data (also reload from local store)
	 */
	useEffect(() => {
		if (
			!cacheConnectedAccount ||
			(cacheConnectedAccount &&
				(cacheConnectedAccount.publicKey !== storePublicKey ||
					cacheConnectedAccount.loginOptions !== storeLoginOptions))
		) {
			setLoading(true);
			loadCache();
		}

		return () => {
			setLoading(false);
		};
	}, [loadCache, cacheConnectedAccount, storeLoginOptions, storePublicKey]);

	useEffect(() => {
		// Skip
		if (!cacheConnectedAccount || loading) {
			return;
		}

		const { publicKey, loginOptions } = cacheConnectedAccount;
		// Redux store empty
		// Cache has User info
		// => navigate to `welcomeBack`
		// userHashingOptions
		if (!publicKey && !isEmpty(loginOptions) && loginOptions.userHashingOptions) {
			navigate('/welcomeBack');
			return;
		}

		// Redux store empty
		// Cache empty
		// => navigate to `connectAccount`
		if (!publicKey && isEmpty(storeLoginOptions) && isEmpty(loginOptions)) {
			navigate('/connectAccount');
		}
	}, [loading, navigate, cacheConnectedAccount, storeLoginOptions]);

	return cacheConnectedAccount;
};

export default useWithAccount;
