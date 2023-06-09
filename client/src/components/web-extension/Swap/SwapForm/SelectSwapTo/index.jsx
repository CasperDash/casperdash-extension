import React from 'react';
import { useSelector } from 'react-redux';
import { getSwapTo } from '@cd/selectors/swap';
import SelectAsset from '@cd/web-extension/Common/SelectAsset';
import { useGetTokenBalance } from '@cd/components/hooks/queries/useGetTokenBalance';
import { getPublicKey } from '@cd/selectors/user';
import { useGetCoinMarketData } from '@cd/components/hooks/queries/useGetCoinMarketData';
import Big from 'big.js';
import { useChangeToToken } from '@cd/web-extension/Swap/hooks';

const SelectSwapTo = () => {
    const swapTo = useSelector(getSwapTo);
    const { handleOnChangeInput, handleOnChangeToken } = useChangeToToken();
    const publicKey = useSelector(getPublicKey);
    const { data: { balance = 0 } = { balance: 0 }} = useGetTokenBalance({
      type: swapTo.type,
      publicKey, 
      contractHash: swapTo.contractHash,
      decimals: swapTo.decimals,
    });
    const { data: {price = 0 } = { price: 0} } = useGetCoinMarketData(swapTo.coingeckoId);
    const amountUsd = Big(swapTo.value || 0).times(price).round(8).toNumber();

    return (
      <SelectAsset 
        name="swapTo" 
        label="Swap To" 
        value={swapTo} 
        amountUsd={amountUsd}
        balance={balance}
        onSelect={handleOnChangeToken}
        onChangeAmount={handleOnChangeInput}
        callback={'/swap'}
      />
    )
}

export default SelectSwapTo;