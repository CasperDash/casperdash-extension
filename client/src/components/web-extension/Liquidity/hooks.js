import * as dayjs from 'dayjs';
import { useQuery, useMutation } from '@tanstack/react-query';
import Big from 'big.js';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { putDeploy } from '@cd/actions/deployActions';
import { useGetAMMPair } from '@cd/components/hooks/queries/useGetAMMPair';
import { getPublicKey } from '@cd/selectors/user';
import { signDeployByPrivateKey } from '@cd/services/privateKeyServices';
import { usePersistentContext } from '@cd/components/hooks/usePersistentContext';
import { 
    FUNCTIONS, 
    buildAddLiquidityForCSPRAndTokenDeploy, 
    buildAddLiquidityForTokensDeploy
} from '@cd/services/tokenServices';
import { useMemo, useRef } from 'react';
import { useGetTokenBalance } from '@cd/components/hooks/queries/useGetTokenBalance';
import { useGetCoinMarketData } from '@cd/components/hooks/queries/useGetCoinMarketData';
import APP_CONFIGS from '@cd/config';
import { getTokenX, getTokenY } from '@cd/selectors/liquidity';
import { updateTokenX, updateTokenY } from '@cd/actions/liquidityActions';
import { calculateAmountIn, calculateAmountOut, getLiquidityInfo } from './utils';

const DEFAULT_SETTINGS = {
    slippage: 0.5,
    deadline: 20,
}

export const useGetCurrentPair = () => {
    const { contractHash: fromContractHash } = useSelector(getTokenX);
    const { contractHash: toContractHash } = useSelector(getTokenY);
    
    return useGetAMMPair(fromContractHash, toContractHash);
}

export const useChangeFromToken = () => {
    const dispatch = useDispatch();
    const tokenX = useSelector(getTokenX);
    const tokenY = useSelector(getTokenY);
    const { data: pair = { isUsingRouting: false } } = useGetCurrentPair();

    const handleOnChangeInput = (value) => {
        dispatch(updateTokenX({
            value,
        }));

        const amountOut = calculateAmountOut({
            amountIn: value,
            tokenX,
            tokenY,
            pair,
        })

        dispatch(updateTokenY({
            value: amountOut,
        }));
    };

    const handleOnChangeToken = (selectedTokenX) => {
        if (selectedTokenX.contractHash === tokenX.contractHash && tokenX.type === selectedTokenX.type) {
            return;
        }

        if (tokenY.contractHash === selectedTokenX.contractHash) {
            if (!tokenX.contractHash) { 
                return;
            }

            dispatch(updateTokenY(tokenX));
        }
  
        dispatch(updateTokenX({
            ...selectedTokenX,
            value: ''
        }));
        dispatch(updateTokenY({
            value: '',
        }));
    }

    return {
        handleOnChangeInput,
        handleOnChangeToken
    };
}

export const useChangeToToken = () => {
    const dispatch = useDispatch();
    const tokenY = useSelector(getTokenY);
    const tokenX = useSelector(getTokenX);

    const { data: pair = { isUsingRouting: false } } = useGetCurrentPair();

    const handleOnChangeInput = (value = 0) => {
        dispatch(updateTokenY({
            value,
        }));

        const amountIn = calculateAmountIn({
            amountOut: value,
            tokenX,
            tokenY,
            pair,
        });

        dispatch(updateTokenX({
            value: amountIn,
        }));
    };

    const handleOnChangeToken = (selectedTokenY) => {
        if (selectedTokenY.contractHash === tokenY.contractHash && tokenY.type === selectedTokenY.type) {
            return;
        }
        
        if (tokenX.contractHash === selectedTokenY.contractHash) {
            if (!tokenY.contractHash) { 
                return;
            }

            dispatch(updateTokenX(tokenY));
        }
  
        dispatch(updateTokenY({
            ...selectedTokenY,
            value: 0
        }));
        dispatch(updateTokenX({
            value: 0,
        }));
    }

    return {
        handleOnChangeInput,
        handleOnChangeToken,

    };
}

export const useGetBalance = (contractHash) => {
    return useQuery(['balance', contractHash], async () => {
        return 0;
    });
}

export const useCalculateAmountOutMin = () => {
    const tokenY = useSelector(getTokenY);
    const [swapSettings] = useSwapSettings();

    const amountOutMin = Big(tokenY.value || 0).times(1 - swapSettings.slippage / 100).round(tokenY.decimals, 0).toNumber();

    return amountOutMin;
}

export const useAddLiquidity = (options) => {
	const publicKey = useSelector(getPublicKey);
	const dispatch = useDispatch();
    const toastIdRef = useRef(null);
    const [swapSettings] = useSwapSettings();

    const calculateAmountWithSlippage = (amount) => {
        return Big(amount).times(1 - swapSettings.slippage / 100).round().toNumber();
    }

    const putSignedDeploy = async (signedDeploy) => {
		const { data: hash, error } = await dispatch(putDeploy(signedDeploy));
		if (error) {
			throw error;
		}

		return hash.deployHash;
	};

    return useMutation({
        mutationFn: async ({
            entryPoint,
            fromContractHash, 
            toContractHash, 
            amountIn, 
            amountOut, 
            deadlineInMinutes,
            cspr,
            token
        }) => {
            toastIdRef.current = toast.loading('Preparing deploy');
            let builtDeploy = null;
            const deadline = dayjs().add(deadlineInMinutes, 'minutes').valueOf();

            switch (entryPoint) {
                case FUNCTIONS.ADD_LIQUIDITY:
                    builtDeploy = await buildAddLiquidityForTokensDeploy(
                        APP_CONFIGS.LIQUIDITY_FM_CONTRACT_HASH, 
                        {
                            contractHashX: fromContractHash,
                            contractHashY: toContractHash,
                            amountXDesired: amountIn,
                            amountYDesired: amountOut,
                            amountXMin: calculateAmountWithSlippage(amountIn),
                            amountYMin: calculateAmountWithSlippage(amountOut),
                            publicKey,
                            deadline,
                        }
                    );

                    break;
                case FUNCTIONS.ADD_LIQUIDITY_CSPR: {
                    const amountTokenDesired = token.contractHash === fromContractHash ? amountIn : amountOut;
                    const amountCSPRDesired = cspr.contractHash === fromContractHash ? amountIn : amountOut;
                    builtDeploy = await buildAddLiquidityForCSPRAndTokenDeploy(
                        APP_CONFIGS.LIQUIDITY_FM_CONTRACT_HASH,
                        {
                            tokenContractHash: token.contractHash,
                            amountTokenDesired: amountTokenDesired,
                            amountTokenMin: calculateAmountWithSlippage(amountTokenDesired),
                            amountCSPRDesired: amountCSPRDesired,
                            amountCSPRMin: calculateAmountWithSlippage(amountCSPRDesired),
                            publicKey,
                            deadline,
                        }
                    );

                    break;
                }
                default:
                    throw new Error('Invalid function type');
            }

            if (!builtDeploy) {
                throw new Error('Cannot build deploy');
            }

            toast.update(toastIdRef.current, { render: 'Please review the deploy' });
            const result = await signDeployByPrivateKey(builtDeploy);

            toast.update(toastIdRef.current, { render: 'Putting deploy' });

            return putSignedDeploy(result);
        },
        ...options,
        onSuccess: (deployHash, variables, context) => {
            toast.update(toastIdRef.current, {
				render: `Deploy hash: ${deployHash}`,
				type: 'success',
				isLoading: false,
				autoClose: 5000,
			});
            
            options.onSuccess && options.onSuccess(deployHash, variables, context);
        },
        onError: (error, variables, context) => {
            toast.update(toastIdRef.current, {
                render: error.message,
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });

            options.onError && options.onError(error, variables, context);
        },
    }, 
    );
}

export const useTokenX = () => {
    const tokenX = useSelector(getTokenX);
    const publicKey = useSelector(getPublicKey);
    const { data: { balance = 0 } = { balance: 0 }} = useGetTokenBalance({
        type: tokenX.type,
        publicKey, 
        contractHash: tokenX.contractHash,
        decimals: tokenX.decimals,
    });
    const { data: {price = 0 } = { price: 0} } = useGetCoinMarketData(tokenX.coingeckoId);
    const amountUsd = Big(tokenX.value || 0).times(price).round(8).toNumber();

    return {
        ...tokenX,
        balance,
        amountUsd
    }
}

export const useSwapTo = () => {
    const tokenY = useSelector(getTokenY);
    const publicKey = useSelector(getPublicKey);
    const { data: { balance = 0 } = { balance: 0 }}
        = useGetTokenBalance({
            type: tokenY.type,
            publicKey,
            contractHash: tokenY.contractHash,
            decimals: tokenY.decimals,
        });
    const { data: {price = 0 } = { price: 0} } = useGetCoinMarketData(tokenY.coingeckoId);
    const amountUsd = Big(tokenY.value || 0).times(price).round(8).toNumber();
    
    return {
        ...tokenY,
        balance,
        amountUsd
    }
}

// eslint-disable-next-line complexity
export const useValidateSwap = () => {
    const tokenX = useTokenX();
    const tokenY = useSwapTo();
    const { isLoading, data: pairData } = useGetCurrentPair();

    if (!isLoading && !pairData) {
        return {
            isValid: false,
            error: 'Cannot get pair data',
        };
    }

    if (!tokenX.contractHash || !tokenY.contractHash) {
        return {
            isValid: false,
            error: 'Please select token',
        };
    }

    if (tokenX.contractHash === tokenY.contractHash) {
        return {
            isValid: false,
            error: 'Tokens must be different',
        };
    }

    if (tokenX.value <= 0) {
        return {
            isValid: false,
            error: 'Please enter amount',
        };
    }

    if (tokenX.value > tokenX.balance) {
        return {
            isValid: false,
            error: 'Insufficient balance',
        };
    }

    if ((tokenX.value <= 0 && tokenY.value > 0) || (tokenX.value > 0 && tokenY.value === 0)) {
        return {
            isValid: false,
            error: 'Insufficient liquidity for this trade.',
        };
    }

    return {
        isValid: true,
        error: '',
    };
}


export const useSwapSettings = () => {
    const [data, ...rest] = usePersistentContext('swapSettings', DEFAULT_SETTINGS);

    return [
        {
            slippage: Big(data.slippage || 0).toNumber(),
            deadline: Big(data.deadline || 0).toNumber(),
        },
        ...rest
    ]
}

export const useGetLiquidityInformations = () => {
    const tokenX = useTokenX();
    const tokenY = useSwapTo();
    const { data: pairData, isLoading } = useGetCurrentPair();

    const { yPerX, xPerY } = useMemo(() => {
      return getLiquidityInfo(tokenX, tokenY, pairData);
    }, [tokenX, tokenY, pairData]);

    if (!pairData || isLoading) {
      return [];
    }
    
    return [
        {
            id: 'yPerX',
            title: `${tokenY.symbol} per ${tokenX.symbol}`,
            value: yPerX
        },
        {
            id: 'xPerY',
            title: `${tokenX.symbol} per ${tokenY.symbol}`,
            value: xPerY
        },
    ]
}