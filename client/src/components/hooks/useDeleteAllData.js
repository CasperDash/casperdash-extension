import { useDispatch } from 'react-redux';
import { deleteAllUserData } from '@cd/actions/userActions';

export const useDeleteAllData = () => {
	const dispatch = useDispatch();

	const deleteAllData = () => {
		dispatch(deleteAllUserData());
	}

	return { deleteAllData };
}