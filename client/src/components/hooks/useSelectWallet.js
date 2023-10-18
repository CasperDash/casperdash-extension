import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedWallet } from '@cd/hooks/useServiceWorker';
import { onBindingAuthInfo } from '@cd/actions/userActions';

export const useSelectWallet = ({onSuccess} = {}) => {
	const dispatch = useDispatch();
	const selectWallet = useCallback(async (uid) => {
		const result = await setSelectedWallet(uid);

		const { publicKey: selectedPublicKey, userDetails } = result;
		dispatch(onBindingAuthInfo({
			publicKey: selectedPublicKey,
			user: userDetails
		}, onSuccess));
	}, [dispatch, onSuccess]);

	return {
		selectWallet
	};
}