import { useQuery } from '@tanstack/react-query'
import { getCoinPrice } from '@cd/apiServices/coingecko/coin/prices';
import _get from 'lodash-es/get';

export const useGetCoinMarketData = (id, options = {}) => {
    return useQuery(['coingecko-coin', id], async () => {
        const result = await getCoinPrice({id});
        
        return {
            marketCap: _get(result, 'market_data.market_cap.usd', 0),
            price: _get(result, 'market_data.current_price.usd', 0),
            priceChange: _get(result, 'market_data.price_change_percentage_24h', 0),
            volume: _get(result, 'market_data.total_volume.usd', 0),
        }
    }, {
        ...options,
        enabled: !!id,
    });
}