import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import { getConnectedAccountLocalStorage } from '@cd/actions/userActions';
import { getPublicKey } from '@cd/selectors/user';

const WithAccount = ({ children }) => {
	const cacheConnectedAccount = getConnectedAccountLocalStorage();

	/**
   * With redux-persist implemented,
	 * publicKey stays in extension state as long as User doesn't lock
	 */
	const publicKey = useSelector(getPublicKey);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!cacheConnectedAccount) {
			navigate('/connectAccount');
			return;
		}

		const { loginOptions: loginOptionsCache } = cacheConnectedAccount;
		/**
		 * Navigate to `/welcomeBack` screen when found cached User info
		 * Otherwise, redirect back to connect Account screen
		 */
		if (!publicKey) {
			if (loginOptionsCache?.userInfo && loginOptionsCache?.userHashingOptions) {
				navigate('/welcomeBack');
				return;
			}

			navigate('/connectAccount');
		}
	}, [cacheConnectedAccount, publicKey, navigate, dispatch]);

	return children;
};

// export default WithAccount;
export default connect(state => {
  console.log(`🚀 ~ state`, state)
  return state;
})(WithAccount);
