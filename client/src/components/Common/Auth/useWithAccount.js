import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';

const asyncAccountValidator = async (navigate) => {
	const user = await getConnectedAccountChromeLocalStorage();
	/**
	 * Make sure user must be valid before navigating to other route
	 */
	const isValidUserShape = Boolean(user && !isEmpty(user?.loginOptions));

	if (!user.publicKey && isValidUserShape) {
		navigate('/welcomeBack');
		return;
	}

	if (!!user.publicKey && !isValidUserShape) {
		navigate('/connectAccount');
	}
};

const useWithAccount = () => {
	const navigate = useNavigate();

	useEffect(() => {
		asyncAccountValidator(navigate);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return undefined;
};

export default useWithAccount;
