import { useSelector } from 'react-redux';
import _get from 'lodash-es/get';
import { getMassagedUserDetails } from '@cd/selectors/user';

const useBalance = () => {
	const userDetails = useSelector(getMassagedUserDetails);

	return _get(userDetails, 'balance.displayBalance', 0);
}

export default useBalance;