import React, { useEffect } from 'react';
import createReactClass from 'create-react-class';
import { isSigningPopupWindow } from '@cd/components/hooks/useServiceWorker';
import { useNavigate } from 'react-router-dom';

const DappConnectorRequired = ({ children }) => {
	const navigate = useNavigate();

	useEffect(() => {
		const checkIsSigningPopupWindow = async () => {
			const result = await isSigningPopupWindow();
			if (!result) {
				navigate('/');
			}
		};

		checkIsSigningPopupWindow();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return React.cloneElement(children);
};

export const withDappConnectorRequired = (Component) => {
	// eslint-disable-next-line react/prefer-es6-class
	return createReactClass({
		displayName: 'DappConnectorRequired',
		render: function () {
			return (
				<DappConnectorRequired>
					<Component {...this.props} />
				</DappConnectorRequired>
			);
		},
	});
};

export default DappConnectorRequired;
