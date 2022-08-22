import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import { getCurrentUserSW } from '@cd/components/hooks/useServiceWorker';

const asyncAccountValidator = navigate => {
	return async (dispatch, getState) => {
		const {
			user: { publicKey },
		} = getState();
		const user = await getCurrentUserSW();

		if ( !publicKey && user) {
			console.log(">> WELCOME BACK")
			navigate('/welcomeBack');
			return;
		}

		if ( !publicKey && !user) {
			console.log(">> CONNECT ACC")
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
