import React, { useEffect, useState } from 'react';
import createReactClass from 'create-react-class';
import { useDispatch, useSelector } from 'react-redux';
import { isUserExist } from '@cd/components/hooks/useServiceWorker';
import { setLoginModalOpen } from '@cd/actions/loginModalAction';
import { getLoginModalOpen } from '@cd/selectors/loginModal';
import { isUsingLedgerSelector } from '@cd/selectors/user';

const ServiceWorkerRequired = ({ children }) => {
	const dispatch = useDispatch();
	const isOpen = useSelector(getLoginModalOpen);
	const isUsingLedger = useSelector(isUsingLedgerSelector);

	const [isUserExisting, setUserExistingState] = useState();

	useEffect(() => {
		const timer = setTimeout(() => {
			isUserExist().then((result) => {
				if (!result && !isOpen && !isUsingLedger) {
					dispatch(setLoginModalOpen(true));
				}
				setUserExistingState(!!result);
			});
		}, 300);

		return () => clearTimeout(timer);
	}, [dispatch, isOpen, isUsingLedger]);

	return React.cloneElement(children, { isUserExisting });
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
