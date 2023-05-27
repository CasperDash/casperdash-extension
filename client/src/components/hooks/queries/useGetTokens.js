import { useQuery } from '@tanstack/react-query'
import { getListTokens } from '@cd/apiServices/friendlyMarket/tokens';

export const MAP_COINGECKO_IDS = {
    'wcspr': 'casper-network',
    'cspr': 'casper-network',
    'deth': 'ethereum',
    'dusdc': 'usd-coin',
    'dusdt': 'tether',
    'dai': 'dai',
    'frax': 'frax',
}

export const useGetTokens = (options = {}) => {
    return useQuery(['tokens'], async () => {
        const tokens = await getListTokens();

        return tokens.map((token) => {
            const { symbol = '' } = token;
            const coingeckoId = MAP_COINGECKO_IDS[symbol.toLowerCase()];
            
            return {
                ...token,
                coingeckoId,
            }
        });
    }, options);
}