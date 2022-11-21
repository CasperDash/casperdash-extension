import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import routes from '@cd/app/web-extension/routeConfig';

const asyncAccountValidator = (navigate, location) => {
	return async (_, getState) => {
		const {
			user: { publicKey },
		} = getState();
		const user = await getConnectedAccountChromeLocalStorage();
		/**
		 * Make sure user must be valid before navigating to other route
		 */
		const isValidUserShape = Boolean(user && !isEmpty(user?.loginOptions));
		if (isValidUserShape) {
			navigate(!user.publicKey ? '/welcomeBack' : '/');
			return;
		}

		// do nothing if in outer routes
		const pathname = location.pathname;
		if (routes.outerRoutes.find((route) => route.route === pathname)) {
			return;
		}

		if (!publicKey && !isValidUserShape) {
			navigate('/connectAccount');
		}
	};
};

const useWithAccount = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		dispatch(asyncAccountValidator(navigate, location));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return undefined;
};

export default useWithAccount;
