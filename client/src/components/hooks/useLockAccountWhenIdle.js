import { useNavigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { lockAccount } from '@cd/actions/userActions';
import { getAutoLockTime } from '@cd/selectors/settings';

const useLockAccountWhenIdle = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const autoLockTime = useSelector(getAutoLockTime);

	const handleOnIdle = () => {
		dispatch(lockAccount());
		navigate('/welcomeBack');
	};

	useIdleTimer({
		timeout: autoLockTime,
		onIdle: handleOnIdle,
		debounce: 500,
	});
};

export default useLockAccountWhenIdle;
