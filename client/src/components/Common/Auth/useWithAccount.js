import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import { getConnectedAccountChromeLocalStorage } from '@cd/actions/userActions.utils';
import { getPublicKeyAndLoginOptions } from '@cd/selectors/user';
import { getCurrentUserSW, getActivePublicKey } from '@cd/components/hooks/useServiceWorker';

const asyncAccountValidator = navigate => {
	return async (dispatch, getState) => {
		const {
			user: { publicKey,  },
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
	}, []);

	return undefined;
};

export default useWithAccount;
