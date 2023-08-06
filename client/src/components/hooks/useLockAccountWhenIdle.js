import { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAutoLockTime } from '@cd/selectors/settings';
import { AUTO_LOCK_TIMEOUT_ALARM } from '@cd/constants/alarm';
import { setLoginModalOpen } from '@cd/actions/loginModalAction';
import { getLoginModalOpen } from '@cd/selectors/loginModal';
import { isUsingLedgerSelector } from '@cd/selectors/user';
import { browser } from './useServiceWorker';

const MAX_RETRY_TIME = 10;

const useLockAccountWhenIdle = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const autoLockTime = useSelector(getAutoLockTime);
	const isLoginModalOpen = useSelector(getLoginModalOpen);
	const isUsingLedger = useSelector(isUsingLedgerSelector);

	useEffect(() => {
		resetTimer();

		let retryTime = 0;
		const interval = setInterval(() => {
			try {
				retryTime += 1;
				if (retryTime >= MAX_RETRY_TIME) {
					clearInterval(interval);
				}
				if (!browser || isUsingLedger) {
					return;
				}
	
				browser.runtime.onMessage.addListener((event) => {
					// Make sure login modal does not open.
					if (typeof event !== 'object') {
						return;
					}
		
					if (event.type === 'LOCK_WALLET') {
						if (isLoginModalOpen) {
							dispatch(setLoginModalOpen(false));
						}
	
						navigate('/welcomeBack');
					}
				});

				clearInterval(interval);
			} catch (_err) {
				//TODO: Handle error
			}
		}, 1000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const resetTimer = () => {
		browser.alarms.clear(AUTO_LOCK_TIMEOUT_ALARM);
		browser.alarms.create(AUTO_LOCK_TIMEOUT_ALARM, {
			delayInMinutes: autoLockTime,
			periodInMinutes: autoLockTime,
		});
	};

	useIdleTimer({
		onAction: resetTimer,
		debounce: 500,
	});
};

export default useLockAccountWhenIdle;
