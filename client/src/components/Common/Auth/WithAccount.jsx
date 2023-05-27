import useLockAccountWhenIdle from '@cd/components/hooks/useLockAccountWhenIdle';
import useWithAccount from './useWithAccount';

const WithAccount = ({ children }) => {
	useWithAccount();
	useLockAccountWhenIdle();

	return children;
};

export default WithAccount;
