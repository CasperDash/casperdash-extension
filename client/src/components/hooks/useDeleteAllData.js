import { useDispatch } from 'react-redux';
import { deleteAllUserData } from '@cd/actions/userActions';

export const useDeleteAllData = () => {
	const dispatch = useDispatch();

	const deleteAllData = async () => {
		await dispatch(deleteAllUserData());
	}

	return { deleteAllData };
}