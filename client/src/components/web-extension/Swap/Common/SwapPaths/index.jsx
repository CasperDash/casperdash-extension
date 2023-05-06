import React from 'react';
import ArrowOutlineDownIcon from '@cd/assets/image/arrow-outline-down.svg';
import { useGetTokens } from '@cd/components/hooks/queries/useGetTokens';
import { useGetCurrentPair, useSwapFrom, useSwapTo } from '@cd/web-extension/Swap/hooks';

import './SwapPaths.scss';

const SwapPaths = () => {
    const swapFrom = useSwapFrom();
    const swapTo = useSwapTo();
    const { data: pair = {} } = useGetCurrentPair();
    const { data: tokens } = useGetTokens();

    let paths = [];
    if (pair.isUsingRouting) {
        paths = pair.path;
    } else {
        paths = [swapFrom.contractHash, swapTo.contractHash];
    }

    return (
        <div className="cd_we_swap_paths">
            {
               paths.map((path, index) => {
                    const token = tokens.find((token) => token.contractHash === path.replace('hash-', ''));

                    return (
                        <div key={path} className="cd_we_swap_paths--item">
                            <div className="cd_we_swap_paths__icon">
                                <img src={token?.logoURI} alt={token?.symbol} width={'16px'} height={'16px'}/>
                            </div>
                            <div className="cd_we_swap_paths--name">
                                {token?.symbol}
                            </div>
                            {
                                index < paths.length - 1 && (
                                    <div className="cd_we_swap_paths--arrow">
                                        <ArrowOutlineDownIcon />
                                    </div>
                                )
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SwapPaths;