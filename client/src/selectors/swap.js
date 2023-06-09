import { createSelector } from 'reselect';

export const getSwapFrom = createSelector(state => state.swap.swapFrom, swapFrom => swapFrom);

export const getSwapTo = createSelector(state => state.swap.swapTo, swapTo => swapTo);

export const getSettings = createSelector(state => state.swap.settings, settings => settings);

export const getIsReceiveExact = createSelector(state => state.swap.isReceiveExact, isReceiveExact => isReceiveExact);