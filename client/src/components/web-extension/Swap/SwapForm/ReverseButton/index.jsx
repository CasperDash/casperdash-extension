import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSwapFrom, getSwapTo } from '@cd/selectors/swap';
import { updateSwapFrom, updateSwapTo } from '@cd/actions/swapActions';
import ReverseIcon from '@cd/assets/image/reverse.svg';

export const ReverseButton = () => {
    const dispatch = useDispatch();
    const swapFrom = useSelector(getSwapFrom);
    const swapTo = useSelector(getSwapTo);

    const handleReverse = () => {
        dispatch(updateSwapFrom(swapTo));
        dispatch(updateSwapTo(swapFrom));
    }

    return (
        <div className="cd_we_swap_reverse" onClick={handleReverse}>
            <ReverseIcon />
        </div>
    )
}