import { useQuery } from '@tanstack/react-query';
import { getCurrentConnectedUrl } from '@cd/hooks/useServiceWorker';

export const useGetCurrentConnectedUrl = () => {
	return useQuery({
		queryKey: ['dapp', 'currentConnectedUrl'],
		queryFn: getCurrentConnectedUrl
	})
}