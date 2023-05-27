import { FUNCTIONS } from '@cd/services/tokenServices';
import Big from 'big.js';
import { TYPES } from './constants';

export const getAmountIn = (
    reserveIn,
    reserveOut,
    amountOut
  ) => {
    if (!amountOut) {
        return 0;
    }
    const numerator = Big(reserveIn).times(amountOut).times(1000);
    const denominator = Big(reserveOut).minus(amountOut).times(997);

    return numerator.div(Big(denominator).add(1)).toNumber();
}


export const getAmountOut = (
    reserveIn,
    reserveOut,
    amountIn
  ) => {
    if (!amountIn) {
        return 0;
    }
    const amountInWithFee = Big(amountIn).times(997);
    const numerator = Big(amountInWithFee).times(reserveOut);
    const denominator = Big(reserveIn).times(1000).add(amountInWithFee);

    return numerator.div(denominator).toNumber();
}

export const findReverseRouteIntToken1PairByContractHash = (
  contractHash,
  pairRouteData
) => {
  const { intToken1Pair } = pairRouteData;
  if (intToken1Pair.token0 === contractHash) {
    return [intToken1Pair.reserve1, intToken1Pair.reserve0];
  }

  if (intToken1Pair.token1 === contractHash) {
    return [intToken1Pair.reserve0, intToken1Pair.reserve1];
  }

  return [0, 0];
};

export const findReverseRouteToken0IntPairByContractHash = (
  contractHash,
  pairRouteData
) => {
  const { token0IntPair } = pairRouteData;
  if (token0IntPair.token0 === contractHash) {
    return [token0IntPair.reserve0, token0IntPair.reserve1];
  }

  if (token0IntPair.token1 === contractHash) {
    return [token0IntPair.reserve1, token0IntPair.reserve0];
  }

  return [0, 0];
};

export const getMatchedEntryPoint = (swapFromType, swapToType, {isReceiveExact}) => {
  if (swapFromType === TYPES.NATIVE && swapToType === TYPES.ERC20) {
    if (isReceiveExact) {
        return FUNCTIONS.SWAP_CSPR_FOR_EXACT_TOKENS;
    }

    return FUNCTIONS.SWAP_EXACT_CSPR_FOR_TOKENS;
  }

  if (swapFromType === TYPES.ERC20 && swapToType === TYPES.NATIVE) {
    if (isReceiveExact) {
        return FUNCTIONS.SWAP_TOKENS_FOR_EXACT_CSPR;
    }

    return FUNCTIONS.SWAP_EXACT_TOKENS_FOR_CSPR;
  }

  if (swapFromType === TYPES.ERC20 && swapToType === TYPES.ERC20) {
    if (isReceiveExact) {
      return FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS;
    }

    return FUNCTIONS.SWAP_EXACT_TOKENS_FOR_TOKENS;
  }
}

export const getSwapInfo = (swapFrom, swapTo, pairData) => {
  const fee = Big(swapFrom.value || 0).times(0.3).div(100).round(swapFrom.decimals, 0).toNumber();
  const priceImpact = swapTo.amountUsd ? Big(100).minus(Big(swapFrom.amountUsd || 0).div(swapTo.amountUsd || 1).times(100)).toFixed(4, 0): 0;
  const rate = swapTo.value > 0 ? Big(swapTo.value).div(swapFrom.value || 1).toFixed(8, 0): 0;

  return {
    fee,
    priceImpact,
    rate: rate > 0 ? rate : calculateAmountOut({
      amountIn: 1,
      swapFrom,
      swapTo,
      pair: pairData,
    }),
  }
}

export const calculateAmountOut = ({amountIn, swapFrom, swapTo, pair}) => {
  if (!pair) {
    return 0;
  }

  const calculatePrice = ({amountIn, reverseIn, reverseOut, decimals}) => {
    return Big(getAmountOut(reverseIn, reverseOut, amountIn)).round(decimals, 0).toNumber();
  }

  if (pair.isUsingRouting) {
    const [reserve0, reserve1] = findReverseRouteToken0IntPairByContractHash(
        swapFrom.contractHash,
        pair
    );
    const bridgeAmount = getAmountOut(reserve0, reserve1, amountIn);
    const [reserve0IntPair, reserve1IntPair] = findReverseRouteIntToken1PairByContractHash(
        swapTo.contractHash,
        pair
    );

    return calculatePrice({
      amountIn: bridgeAmount,
      reverseIn: reserve0IntPair,
      reverseOut: reserve1IntPair,
      decimals: swapTo.decimals,
    });
  } else if (pair && pair.token1Price && swapTo.contractHash && swapFrom.contractHash) {
    return calculatePrice(
      {amountIn, reverseIn: pair.reserve0, reverseOut: pair.reserve1, decimals: swapTo.decimals}
    );
  }

  return 0;
}

export const calculateAmountIn = ({amountOut, swapFrom, swapTo, pair}) => {
  if (!pair) {
    return 0;
  }

  const calculatePrice = ({amountOut, reverseIn, reverseOut, decimals}) => {
    return Big(getAmountIn(reverseIn, reverseOut, amountOut)).round(decimals, 0).toNumber();
  }

  if (pair.isUsingRouting) {
    const [reserve0, reserve1] =
    findReverseRouteIntToken1PairByContractHash(
      swapTo.contractHash,
      pair
    );
    const bridgeAmount = getAmountIn(reserve0, reserve1, amountOut);

    const [reserve0IntPair, reserve1IntPair] =
      findReverseRouteToken0IntPairByContractHash(
        swapFrom.contractHash,
        pair
      );

    return calculatePrice({
      amountOut: bridgeAmount,
      reverseIn: reserve0IntPair,
      reverseOut: reserve1IntPair,
      decimals: swapFrom.decimals,
    });
  } else if (pair && swapFrom.contractHash && swapTo.contractHash) {

    return calculatePrice({amountOut, reverseIn: pair.reserve0, reverseOut: pair.reserve1, decimals: swapFrom.decimals});
  }
}