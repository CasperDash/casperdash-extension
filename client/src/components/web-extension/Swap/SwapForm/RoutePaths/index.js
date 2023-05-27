import React from 'react';
import { useGetCurrentPair } from '@cd/web-extension/Swap/hooks';
import SwapPaths from '@cd/web-extension/Swap/Common/SwapPaths';

import './RoutePaths.scss';

const RoutePaths = () => {
    const { data: pair = {}, isLoading } = useGetCurrentPair();

    if (!pair.isUsingRouting || isLoading) {
        return null;
    }


    return (
        <div className="cd-we-route">
            <div>
                <div className="cd-we-route__title">
                    <span>Route</span>
                </div>
            </div>
            <SwapPaths />
        </div>
    )
}

export default RoutePaths;