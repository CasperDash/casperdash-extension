import React, { useEffect } from 'react';
import { isUserExist } from '@cd/components/hooks/useServiceWorker';
import { useDispatch } from 'react-redux';
import { setLoginModalOpen } from '@cd/actions/loginModalAction';

const ServiceWorkerRequired = ({ children }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const timer = setTimeout(() => {
			isUserExist().then((result) => {
				if (!result) {
					dispatch(setLoginModalOpen(true));
				}
			});
		}, 300);

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return children;
};

export const withServiceWorkerRequired = (Component) => {
	return function (props) {
		return (
			<ServiceWorkerRequired>
				<Component {...props} />
			</ServiceWorkerRequired>
		);
	};
};

export default ServiceWorkerRequired;