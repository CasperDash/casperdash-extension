import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { QUERY_KEYS } from '@cd/constants/queryKeys';
import { getConfigurations } from '@cd/services/configurationServices';
import { getNetwork } from '@cd/selectors/settings';

const useGetConfigs = (
	options = {}
) => {
	const network = useSelector(getNetwork);

	const query = useQuery({
		...options,
		queryKey: [QUERY_KEYS['CONFIG'], network],
		queryFn: () => {
			return getConfigurations(false, network);
		},
		enabled: !!network,
		initialData: {}
	});

	return { ...query };
};

export default useGetConfigs;
