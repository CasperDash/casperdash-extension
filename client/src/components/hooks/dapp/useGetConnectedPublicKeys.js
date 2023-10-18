import { getConnectedSites } from '@cd/hooks/useServiceWorker';
import { useQuery } from '@tanstack/react-query';

export const useGetConnectedPublicKeys = (siteUrl) => {
	return useQuery({
		queryKey: ['dapp', 'connectedPublicKeys', siteUrl],
		queryFn: async () => {
			const connectedSites = await getConnectedSites();

			return Object.keys(connectedSites).filter((publicKey) => {
				return connectedSites[publicKey].includes(siteUrl);
			});
		},
		enabled: !!siteUrl,
	})
}