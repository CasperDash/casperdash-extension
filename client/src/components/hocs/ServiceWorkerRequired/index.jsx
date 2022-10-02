import React, { useEffect, useRef } from 'react';
import { getCurrentUserSW } from '@cd/components/hooks/useServiceWorker';
import { useDispatch } from 'react-redux';
import { setIsOpen } from '@cd/actions/loginModalAction';

const ServiceWorkerRequired = ({ children }) => {
	const dispatch = useDispatch();
    const workerRef = useRef(null);

	useEffect(() => {
		workerRef.current = setTimeout(() => {
			console.log('hello');
			getCurrentUserSW().then((result) => {
				console.log('result: ', result);
				if (!result) {
					dispatch(setIsOpen(true));
				}
			});
		}, 1000);

		return () => clearTimeout(workerRef.current);
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
