import { LIQUIDITY } from "@cd/store/actionTypes";

export const updateTokenX = (tokenX) => {
    return {
        type: LIQUIDITY.UPDATE_TOKEN_X,
        payload: { tokenX },
    };
}

export const updateTokenY = (tokenY) => {
    return {
        type: LIQUIDITY.UPDATE_TOKEN_Y,
        payload: { tokenY },
    };
}

export const reset = () => {
    return {
        type: LIQUIDITY.RESET,
    };
}