import { LIQUIDITY } from "@cd/store/actionTypes";

export const updateLiquidityX = (liquidityX) => {
    return {
        type: LIQUIDITY.UPDATE_LIQUIDITY_X,
        payload: { liquidityX },
    };
}

export const updateLiquidityY = (liquidityY) => {
    return {
        type: LIQUIDITY.UPDATE_LIQUIDITY_Y,
        payload: { liquidityY },
    };
}

export const reset = () => {
    return {
        type: LIQUIDITY.RESET,
    };
}