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
    const denominator = Big(reserveOut).minus(amountOut).times(1000);

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
    const amountInWithFee = Big(amountIn).times(1000);
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

export const getMatchedEntryPoint = (tokenX, tokenY) => {
  if (tokenX.type === TYPES.NATIVE && tokenY.type === TYPES.ERC20) {
    return {
      entryPoint: FUNCTIONS.ADD_LIQUIDITY_CSPR,
      token: tokenY,
      cspr: tokenX,
    }
  }

  if (tokenX.type === TYPES.ERC20 && tokenY.type === TYPES.NATIVE) {
    return {
      entryPoint: FUNCTIONS.ADD_LIQUIDITY_CSPR,
      token: tokenX,
      cspr: tokenY,
    };
  }

  if (tokenX.type === TYPES.ERC20 && tokenY.type === TYPES.ERC20) {
    return {
      entryPoint: FUNCTIONS.ADD_LIQUIDITY,
      token: tokenX,
      cspr: null,
    };
  }
}

export const getLiquidityInfo = (tokenX, tokenY, pairData) => {
  let rate = 0;

  if (tokenX && tokenY && tokenX.contractHash && tokenY.contractHash) {
    rate = calculateAmountOut({
      amountIn: 1,
      tokenX,
      tokenY,
      pair: pairData,
    });
  }

  return {
    xPerY: rate,
    yPerX: rate ? 1 / rate : 0,
  }
}

export const calculateAmountOut = ({amountIn, tokenX, tokenY, pair}) => {
  if (!pair) {
    return 0;
  }

  const calculatePrice = ({amountIn, reverseIn, reverseOut, decimals}) => {
    return Big(getAmountOut(reverseIn, reverseOut, amountIn)).round(decimals, 0).toNumber();
  }

  if (pair.isUsingRouting) {
    const [reserve0, reserve1] = findReverseRouteToken0IntPairByContractHash(
      tokenX.contractHash,
        pair
    );
    const bridgeAmount = getAmountOut(reserve0, reserve1, amountIn);
    const [reserve0IntPair, reserve1IntPair] = findReverseRouteIntToken1PairByContractHash(
      tokenY.contractHash,
        pair
    );

    return calculatePrice({
      amountIn: bridgeAmount,
      reverseIn: reserve0IntPair,
      reverseOut: reserve1IntPair,
      decimals: tokenY.decimals,
    });
  } else if (pair && pair.token1Price && tokenY.contractHash && tokenX.contractHash) {
    return calculatePrice(
      {amountIn, reverseIn: pair.reserve0, reverseOut: pair.reserve1, decimals: tokenY.decimals}
    );
  }

  return 0;
}

export const calculateAmountIn = ({amountOut, tokenX, tokenY, pair}) => {
  if (!pair) {
    return 0;
  }

  const calculatePrice = ({amountOut, reverseIn, reverseOut, decimals}) => {
    return Big(getAmountIn(reverseIn, reverseOut, amountOut)).round(decimals, 0).toNumber();
  }

  if (pair.isUsingRouting) {
    const [reserve0, reserve1] =
    findReverseRouteIntToken1PairByContractHash(
      tokenY.contractHash,
      pair
    );
    const bridgeAmount = getAmountIn(reserve0, reserve1, amountOut);

    const [reserve0IntPair, reserve1IntPair] =
      findReverseRouteToken0IntPairByContractHash(
        tokenX.contractHash,
        pair
      );

    return calculatePrice({
      amountOut: bridgeAmount,
      reverseIn: reserve0IntPair,
      reverseOut: reserve1IntPair,
      decimals: tokenX.decimals,
    });
  } else if (pair && tokenX.contractHash && tokenY.contractHash) {

    return calculatePrice({amountOut, reverseIn: pair.reserve0, reverseOut: pair.reserve1, decimals: tokenX.decimals});
  }
}