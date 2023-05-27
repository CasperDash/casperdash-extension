import { SWAP } from "@cd/store/actionTypes";

export const updateSwapFrom = (swapFrom) => {
	return {
		type: SWAP.UPDATE_SWAP_FROM,
		payload: { swapFrom },
	};
};

export const updateSwapTo = (swapTo) => {
    return {
        type: SWAP.UPDATE_SWAP_TO,
        payload: { swapTo },
    };
}

export const updateSettings = (settings) => {
    return {
        type: SWAP.UPDATE_SETTINGS,
        payload: { settings },
    };
}
export const updateIsReceiveExact = (isReceiveExact) => {
    return {
        type: SWAP.UPDATE_IS_RECEIVE_EXACT,
        payload: { isReceiveExact },
    };
}

export const reset = () => {
    return {
        type: SWAP.RESET,
    };
}