import React from 'react';
import { useSelector } from 'react-redux';
import Big from 'big.js';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { getIsReceiveExact, getSwapFrom, getSwapTo } from '@cd/selectors/swap';
import { useCalculateAmountOutMin, useGetCurrentPair, useGetSwapInformations, useSwapSettings, useSwapTokens } from '@cd/web-extension/Swap/hooks';
import APP_CONFIGS from '@cd/config';
import { getMatchedEntryPoint } from '@cd/web-extension/Swap/utils';
import SwapPaths from '@cd/web-extension/Swap/Common/SwapPaths';
import Divider from '@cd/components/Common/Divider';
import { getPublicKey } from '@cd/selectors/user';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import { getGasFee } from '@cd/services/tokenServices';
import { TruncatedText } from '@cd/web-extension/Common/TruncatedText';

import './SwapConfirmation.scss';

const SwapConfirmation = () => {
    const navigate = useNavigate();
    const swapFrom = useSelector(getSwapFrom);
    const swapTo = useSelector(getSwapTo);
    const isReceiveExact = useSelector(getIsReceiveExact);
    const [swapSettings] = useSwapSettings();
    const amountOutMin = useCalculateAmountOutMin();
    const { data: pair } = useGetCurrentPair();
    const { mutate, isLoading } = useSwapTokens({
        // eslint-disable-next-line no-console
        onError: (error) => console.log(error),
        onSuccess: () => {
            navigate('/swap', { state: { name: 'Swap' } });
        }
    });
    const swapInformations = useGetSwapInformations();
    const publicKey = useSelector(getPublicKey);
    const entryPoint = getMatchedEntryPoint(swapFrom.type, swapTo.type, { isReceiveExact });

    const gasFee = getGasFee(entryPoint);

    const handleConfirmSwap = () => {
        const amountInValue = Big(swapFrom.value).round(swapFrom.decimals, 0).toNumber();

        let path = [swapFrom.contractHash, swapTo.contractHash].map((hash) => `hash-${hash}`);
        if (pair.isUsingRouting) {
            path = pair.path;
        }

        const amountIn = parseInt(Big(amountInValue * 10 ** swapFrom.decimals).toNumber());
        const amountOut = parseInt(Big(amountOutMin * 10 ** swapTo.decimals).toNumber());

        return mutate({ 
            entryPoint,
            amountIn,
            amountOut,
            deadlineInMinutes: swapSettings.deadline,
            path,
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
            value: `${swapFrom.value} ${swapFrom.symbol}`,
            id: 'amountIn'
        },
        {
            title: 'Amount Out',
            value: `${swapTo.value} ${swapTo.symbol}`,
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
                    <div className="cd_we_swap_confirmation__content--route">
                        <SwapPaths/>
                    </div>
                    <Divider className="cd_we_swap_confirmation__content--divider"/>
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
                        swapInformations.map((swapInformation) => {
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

export default SwapConfirmation;