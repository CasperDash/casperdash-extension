import React from 'react';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import { getTokenX } from '@cd/selectors/liquidity';
import SelectAsset from '@cd/web-extension/Common/SelectAsset';
import { getPublicKey } from '@cd/selectors/user';
import { useGetTokenBalance } from '@cd/components/hooks/queries/useGetTokenBalance';
import { useGetCoinMarketData } from '@cd/components/hooks/queries/useGetCoinMarketData';
import { useChangeFromToken } from '@cd/web-extension/Liquidity/hooks';

const SelectFrom = () => {
    const tokenX = useSelector(getTokenX);
    const { handleOnChangeInput, handleOnChangeToken } = useChangeFromToken();
    const publicKey = useSelector(getPublicKey);
    const { data: { balance = 0 } = { balance: 0 }} = useGetTokenBalance({
      type: tokenX.type,
      publicKey, 
      contractHash: tokenX.contractHash,
      decimals: tokenX.decimals,
    });
    const { data: {price = 0 } = { price: 0} } = useGetCoinMarketData(tokenX.coingeckoId);
    const amountUsd = Big(tokenX.value || 0).times(price).round(8).toNumber();


    return (
      <SelectAsset 
        name="swapFrom" 
        label="" 
        value={tokenX} 
        amountUsd={amountUsd}
        onSelect={handleOnChangeToken}
        onChangeAmount={handleOnChangeInput}
        balance={Big(balance).toNumber()}
        callback={'/liquidity'}
      />
    )
}

export default SelectFrom;