import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';

const asyncAccountValidator = navigate => {
	return async (_, getState) => {
		const {
			user: { publicKey },
		} = getState();
		const user = await getConnectedAccountChromeLocalStorage();
		console.log(`🚀 ~ return ~ user`, publicKey, user)

		if ( !publicKey && user) {
			navigate('/welcomeBack');
			return;
		}

		if ( !publicKey && !user) {
			navigate('/connectAccount');
			return;
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
