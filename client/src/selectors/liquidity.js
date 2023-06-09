import { createSelector } from 'reselect';

export const getTokenX = createSelector(state => state.liquidity.tokenX, tokenX => tokenX);

export const getTokenY = createSelector(state => state.liquidity.tokenY, tokenY => tokenY);