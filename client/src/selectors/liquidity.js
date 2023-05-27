import { createSelector } from 'reselect';

export const getLiquidityX = createSelector(state => state.liquidity.liquidityX, liquidityX => liquidityX);

export const getLiquidityY = createSelector(state => state.liquidity.liquidityY, liquidityY => liquidityY);