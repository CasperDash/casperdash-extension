import React from 'react';
import { useSelector } from 'react-redux';
import { getSwapFrom } from '@cd/selectors/swap';
import SelectAsset from '@cd/web-extension/Common/SelectAsset/index';
import { getPublicKey } from '@cd/selectors/user';
import { useGetTokenBalance } from '@cd/components/hooks/queries/useGetTokenBalance';
import { useGetCoinMarketData } from '@cd/components/hooks/queries/useGetCoinMarketData';
import Big from 'big.js';
import { useChangeFromToken } from '../../hooks';

const SelectSwapFrom = () => {
    const swapFrom = useSelector(getSwapFrom);
    const { handleOnChangeInput, handleOnChangeToken } = useChangeFromToken();
    const publicKey = useSelector(getPublicKey);
    const { data: { balance = 0 } = { balance: 0 }} = useGetTokenBalance({
      type: swapFrom.type,
      publicKey, 
      contractHash: swapFrom.contractHash,
      decimals: swapFrom.decimals,
    });
    const { data: {price = 0 } = { price: 0} } = useGetCoinMarketData(swapFrom.coingeckoId);
    const amountUsd = Big(swapFrom.value || 0).times(price).round(8).toNumber();


    return (
      <SelectAsset 
        name="swapFrom" 
        label="Swap From" 
        value={swapFrom} 
        amountUsd={amountUsd}
        onSelect={handleOnChangeToken}
        onChangeAmount={handleOnChangeInput}
        balance={Big(balance).toNumber()}
      />
    )
}

export default SelectSwapFrom;