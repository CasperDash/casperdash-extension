import { useDispatch, useSelector } from 'react-redux';
import { getIsHideBalance } from '@cd/selectors/settings';
import { updateIsHideBalance } from '@cd/actions/settingActions';

const useBalanceVisible = () => {
	const dispatch = useDispatch();
	const isHideBalance = useSelector(getIsHideBalance);

	const setBalanceVisible = (isVisible) => {
		dispatch(updateIsHideBalance(!isVisible));
	}


	return {
		isBalanceVisible: !isHideBalance,
		setBalanceVisible,
	}
}

export default useBalanceVisible;