import { useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAutoLockTime } from '@cd/selectors/settings';
import { AUTO_LOCK_TIMEOUT_ALARM } from '@cd/constants/alarm';
import { setLoginModalOpen } from '@cd/actions/loginModalAction';
import { getLoginModalOpen } from '@cd/selectors/loginModal';
import { getLoginOptions } from '@cd/selectors/user';
import { CONNECTION_TYPES } from '@cd/constants/settings';
import { browser } from './useServiceWorker';

const useLockAccountWhenIdle = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const autoLockTime = useSelector(getAutoLockTime);
	const isLoginModalOpen = useSelector(getLoginModalOpen);
	const loginOptions = useSelector(getLoginOptions);

	useEffect(() => {
		resetTimer();

		try {
			if (!browser || loginOptions?.connectionType === CONNECTION_TYPES.ledger) {
				return;
			}

			browser.runtime.onMessage.addListener((event) => {
				// Make sure login modal does not open.
				if (typeof event !== 'object') {
					return;
				}

				console.info('lock: ', new Date());

				if (event.type === 'LOCK_WALLET') {
					if (isLoginModalOpen) {
						dispatch(setLoginModalOpen(false));
					}

					navigate('/welcomeBack');
				}
			});
		} catch (_err) {
			//TODO: Handle error
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const resetTimer = () => {
		chrome.alarms.clear(AUTO_LOCK_TIMEOUT_ALARM);
		chrome.alarms.create(AUTO_LOCK_TIMEOUT_ALARM, {
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
