import { getNetwork } from '@cd/selectors/settings';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConfigurations } from '../../../actions/configurationActions';
import { saveConfigurationToLocalStorage } from '../../../services/configurationServices';

const WithConfigurations = ({ children }) => {
	const dispatch = useDispatch();
	const network = useSelector(getNetwork);

	useEffect(() => {
		async function getConfig() {
			try {
				const { data, error } = await dispatch(getConfigurations());

				if (!error) {
					saveConfigurationToLocalStorage(data, network);
				}
			} catch (error) {
				console.error(error);
			}
		}

		getConfig();
	}, [dispatch, network]);

	return children;
};

export default WithConfigurations;
