import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';

const asyncAccountValidator = navigate => {
	return async (_, getState) => {
		const {
			user: { publicKey },
		} = getState();
		const user = await getConnectedAccountChromeLocalStorage();
		/**
		 * Make sure user must be valid before navigating to other route
		 */
		const isValidUserShape = Boolean(
			user && !isEmpty(user?.loginOptions)
		);

		if ( !publicKey && isValidUserShape) {
			navigate('/welcomeBack');
			return;
		}

		if ( !publicKey && !isValidUserShape) {
			navigate('/connectAccount');
		}
	}
}

const useWithAccount = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(asyncAccountValidator(navigate));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return undefined;
};

export default useWithAccount;
