import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { getUserUndelegating } from '@cd/actions/userActions';
import { getPublicKey } from '@cd/selectors/user';

export const useGetUserUndelegating = (options) => {
	const dispatch = useDispatch();
	const publicKey = useSelector(getPublicKey);

	return useQuery({
		...options,
		queryKey: ['accountUndelegating'],
		queryFn: async () => {
			const { data } = await dispatch(getUserUndelegating(publicKey));

			return data;
		},
		enabled: !!publicKey,
	})
}