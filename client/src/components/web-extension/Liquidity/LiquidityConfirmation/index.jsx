import React from 'react';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useGetLiquidityInformations, useSwapSettings, useAddLiquidity } from '@cd/web-extension/Liquidity/hooks';
import APP_CONFIGS from '@cd/config';
import { getMatchedEntryPoint } from '@cd/web-extension/Liquidity/utils';
import Divider from '@cd/components/Common/Divider';
import { getPublicKey } from '@cd/selectors/user';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import { getGasFee } from '@cd/services/tokenServices';
import { TruncatedText } from '@cd/web-extension/Common/TruncatedText';
import { getTokenX, getTokenY } from '@cd/selectors/liquidity';

import './SwapConfirmation.scss';

const LiquidityConfirmation = () => {
    const navigate = useNavigate();
    const tokenX = useSelector(getTokenX);
    const tokenY = useSelector(getTokenY);
    const [swapSettings] = useSwapSettings();
    const { mutate, isLoading } = useAddLiquidity({
        // eslint-disable-next-line no-console
        onError: (error) => console.log(error),
        onSuccess: () => {
            navigate('/liquidity', { state: { name: 'Liquidity' } });
        }
    });
    const params = useGetLiquidityInformations();
    const publicKey = useSelector(getPublicKey);
    const { entryPoint, cspr, token } = getMatchedEntryPoint(tokenX, tokenY);

    const gasFee = getGasFee(entryPoint);

    const handleConfirmSwap = () => {
        const amountInValue = Big(tokenX.value).round(tokenX.decimals, 0).toNumber();
        const amountOutValue = Big(tokenY.value).round(tokenY.decimals, 0).toNumber();

        const amountIn = parseInt(Big(amountInValue * 10 ** tokenX.decimals).toNumber());
        const amountOut = parseInt(Big(amountOutValue * 10 ** tokenY.decimals).toNumber());

        return mutate({ 
            fromContractHash: tokenX.contractHash,
            toContractHash: tokenY.contractHash,
            entryPoint,
            amountIn,
            amountOut,
            deadlineInMinutes: swapSettings.deadline,
            cspr,
            token,
         });
    };

    const additionalItems = [
        {
            title: 'Contract Hash',
            value:  <MiddleTruncatedText placement="bottom" start={8} end={8}>{APP_CONFIGS.SWAP_FM_CONTRACT_HASH}</MiddleTruncatedText>,
            id: 'contractHash'
        },
        {
            title: 'Public Key',
            value: <MiddleTruncatedText placement="bottom" start={8} end={8}>{publicKey}</MiddleTruncatedText>,
            id: 'publicKey'
        },
        {
            title: 'Payment Amount',
            value: gasFee,
            id: 'paymentAmount'
        },
        {
            title: 'Amount In',
            value: `${tokenX.value} ${tokenX.symbol}`,
            id: 'amountIn'
        },
        {
            title: 'Amount Out',
            value: `${tokenY.value} ${tokenY.symbol}`,
            id: 'amountOut'
        },
        {
            title: 'Entry Point',
            value: <TruncatedText>{entryPoint}</TruncatedText>,
            id: 'entryPoint'
        },
    ]

    return (
        <section className="cd_we_single_section no_bottom_bar">
            <div className="cd_we_swap_confirmation">
                <div className="cd_we_swap_confirmation__content">
                    {
                        additionalItems.map((swapInformation) => {
                            const { title, value, id } = swapInformation;
                            return (
                                <div key={`swap-info-${id}`} className="cd_we_swap_confirmation__content--item">
                                    <span>{title}</span>
                                    <div>{value}</div>
                                </div>
                            )
                        })
                    }
                    <Divider className="cd_we_swap_confirmation__content--divider"/>
                    {
                        params.map((swapInformation) => {
                            const { title, value, id } = swapInformation;
                            return (
                                <div key={`swap-info-${id}`} className="cd_we_swap_confirmation__content--item">
                                    <span>{title}</span>
                                    <span>{value}</span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="cd_we_swap_confirmation__footer">
                    <Button 
                        variant="primary" 
                        className="cd_we_swap_confirmation__footer--confirm" 
                        onClick={handleConfirmSwap}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Confirming...' : 'Confirm'}
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default LiquidityConfirmation;