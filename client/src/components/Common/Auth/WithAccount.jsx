import useWithAccount from './useWithAccount';

const WithAccount = ({ children }) => {
	useWithAccount();

	return children;
};

export default WithAccount;
