import React, { useEffect } from 'react';
import { isUserExist } from '@cd/components/hooks/useServiceWorker';
import { useDispatch } from 'react-redux';
import { setLoginModalOpen } from '@cd/actions/loginModalAction';
import createReactClass from 'create-react-class';
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
	// eslint-disable-next-line react/prefer-es6-class
	return createReactClass({
		displayName: 'ServiceWorkerRequired',
		render: function () {
			return (
				<ServiceWorkerRequired>
					<Component {...this.props} />
				</ServiceWorkerRequired>
			);
		},
	});
};

export default ServiceWorkerRequired;
