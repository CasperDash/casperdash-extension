import * as dayjs from 'dayjs';
import { useQuery, useMutation } from '@tanstack/react-query';
import Big from 'big.js';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { putDeploy } from '@cd/actions/deployActions';
import { updateIsReceiveExact, updateSwapFrom, updateSwapTo } from '@cd/actions/swapActions';
import { useGetAMMPair } from '@cd/components/hooks/queries/useGetAMMPair';
import { getSwapFrom, getSwapTo } from '@cd/selectors/swap';
import { getPublicKey } from '@cd/selectors/user';
import { signDeployByPrivateKey } from '@cd/services/privateKeyServices';
import { usePersistentContext } from '@cd/components/hooks/usePersistentContext';
import { 
    FUNCTIONS, 
    buildExactSwapCSPRForTokensDeploy, 
    buildSwapTokensForExactTokensDeploy, 
    buildSwapExactTokensForCSPRDeploy, 
    buildSwapExactTokensForTokensDeploy,
    buildSwapCSPRForExactTokensDeploy,
    buildSwapTokensForExactCSPRDeploy
} from '@cd/services/tokenServices';
import { getIsReceiveExact } from '@cd/selectors/swap';
import { useMemo, useRef } from 'react';
import { useGetTokenBalance } from '@cd/components/hooks/queries/useGetTokenBalance';
import { useGetCoinMarketData } from '@cd/components/hooks/queries/useGetCoinMarketData';
import APP_CONFIGS from '@cd/config';
import { calculateAmountIn, calculateAmountOut } from './utils';
import { getSwapInfo } from './utils';

const DEFAULT_SETTINGS = {
    slippage: 0.5,
    deadline: 20,
}

export const useGetCurrentPair = () => {
    const { contractHash: fromContractHash } = useSelector(getSwapFrom);
    const { contractHash: toContractHash } = useSelector(getSwapTo);
    
    return useGetAMMPair(fromContractHash, toContractHash);
}

export const useChangeFromToken = () => {
    const dispatch = useDispatch();
    const swapFrom = useSelector(getSwapFrom);
    const swapTo = useSelector(getSwapTo);
    const { data: pair = { isUsingRouting: false } } = useGetCurrentPair();

    const handleOnChangeInput = (value) => {
        dispatch(updateSwapFrom({
            value,
        }));
        dispatch(updateIsReceiveExact(false));

        const amountOut = calculateAmountOut({
            amountIn: value,
            swapFrom,
            swapTo,
            pair,
        })

        dispatch(updateSwapTo({
            value: amountOut,
        }));
    };

    const handleOnChangeToken = (selectedSwapFrom) => {
        if (selectedSwapFrom.contractHash === swapFrom.contractHash && swapFrom.type === selectedSwapFrom.type) {
            return;
        }

        if (swapTo.contractHash === selectedSwapFrom.contractHash) {
            if (!swapFrom.contractHash) { 
                return;
            }

            dispatch(updateSwapTo(swapFrom));
        }
  
        dispatch(updateSwapFrom({
            ...selectedSwapFrom,
            value: ''
        }));
        dispatch(updateSwapTo({
            value: '',
        }));
        dispatch(updateIsReceiveExact(false));
    }

    return {
        handleOnChangeInput,
        handleOnChangeToken
    };
}

export const useChangeToToken = () => {
    const dispatch = useDispatch();
    const swapTo = useSelector(getSwapTo);
    const swapFrom = useSelector(getSwapFrom);

    const { data: pair = { isUsingRouting: false } } = useGetCurrentPair();

    const handleOnChangeInput = (value = 0) => {
        dispatch(updateSwapTo({
            value,
        }));
        dispatch(updateIsReceiveExact(true));

        const amountIn = calculateAmountIn({
            amountOut: value,
            swapFrom,
            swapTo,
            pair,
        });

        dispatch(updateSwapFrom({
            value: amountIn,
        }));
    };

    const handleOnChangeToken = (selectedSwapTo) => {
        if (selectedSwapTo.contractHash === swapTo.contractHash && swapTo.type === selectedSwapTo.type) {
            return;
        }
        
        if (swapFrom.contractHash === selectedSwapTo.contractHash) {
            if (!swapTo.contractHash) { 
                return;
            }

            dispatch(updateSwapFrom(swapTo));
        }
  
        dispatch(updateSwapTo({
            ...selectedSwapTo,
            value: 0
        }));
        dispatch(updateSwapFrom({
            value: 0,
        }));
        dispatch(updateIsReceiveExact(false));
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
    const swapTo = useSelector(getSwapTo);
    const [swapSettings] = useSwapSettings();

    const amountOutMin = Big(swapTo.value || 0).times(1 - swapSettings.slippage / 100).round(swapTo.decimals, 0).toNumber();

    return amountOutMin;
}

export const useSwapTokens = (options) => {
	const publicKey = useSelector(getPublicKey);
	const dispatch = useDispatch();
    const toastIdRef = useRef(null);


    const putSignedDeploy = async (signedDeploy) => {
		const { data: hash, error } = await dispatch(putDeploy(signedDeploy));
		if (error) {
			throw error;
		}

		return hash.deployHash;
	};

    return useMutation({
        mutationFn: async ({entryPoint ,fromContractHash, toContractHash, amountIn, amountOut, deadlineInMinutes, path}) => {
            toastIdRef.current = toast.loading('Preparing deploy');
            let builtDeploy = null;
            const deadline = dayjs().add(deadlineInMinutes, 'minutes').valueOf();

            switch (entryPoint) {
                case FUNCTIONS.SWAP_EXACT_CSPR_FOR_TOKENS:
                    builtDeploy = await buildExactSwapCSPRForTokensDeploy(
                        APP_CONFIGS.SWAP_FM_CONTRACT_HASH, 
                        {
                            toPublicKey: publicKey,
                            fromPublicKey: publicKey,
                            fromContractHash,
                            toContractHash,
                            amountIn,
                            amountOutMin: amountOut,
                            deadline,
                            path,
                        }
                    );

                    break;
                case FUNCTIONS.SWAP_CSPR_FOR_EXACT_TOKENS:
                    builtDeploy = await buildSwapCSPRForExactTokensDeploy(
                        APP_CONFIGS.SWAP_FM_CONTRACT_HASH,
                        {
                            toPublicKey: publicKey,
                            fromPublicKey: publicKey,
                            amountInMax: amountIn,
                            amountOut: amountOut,
                            deadline,
                            path,
                        });

                    break;
                case FUNCTIONS.SWAP_TOKENS_FOR_EXACT_TOKENS:
                    builtDeploy = await buildSwapTokensForExactTokensDeploy(
                        APP_CONFIGS.SWAP_FM_CONTRACT_HASH,
                        {
                            toPublicKey: publicKey,
                            fromPublicKey: publicKey,
                            amountInMax: amountIn,
                            amountOut: amountOut,
                            deadline,
                            path,
                            spenderPackageHash: APP_CONFIGS.SWAP_FM_SPENDER_PACKAGE_HASH
                        }
                    );

                    break;
                case FUNCTIONS.SWAP_EXACT_TOKENS_FOR_TOKENS:
                        builtDeploy = await buildSwapExactTokensForTokensDeploy(
                            APP_CONFIGS.SWAP_FM_CONTRACT_HASH,
                            {
                                toPublicKey: publicKey,
                                fromPublicKey: publicKey,
                                amountIn,
                                amountOutMin: amountOut,
                                deadline,
                                path,
                            }
                        );
    
                    break;
                case FUNCTIONS.SWAP_EXACT_TOKENS_FOR_CSPR:
                    builtDeploy = await buildSwapExactTokensForCSPRDeploy(
                        APP_CONFIGS.SWAP_FM_CONTRACT_HASH,
                        {
                            toPublicKey: publicKey,
                            fromPublicKey: publicKey,
                            amountIn,
                            amountOutMin: amountOut,
                            deadline,
                            path,
                        }
                    );

                    break;
                case FUNCTIONS.SWAP_TOKENS_FOR_EXACT_CSPR:
                    builtDeploy = await buildSwapTokensForExactCSPRDeploy(
                        APP_CONFIGS.SWAP_FM_CONTRACT_HASH,
                        {
                            toPublicKey: publicKey,
                            fromPublicKey: publicKey,
                            amountInMax: amountIn,
                            amountOut: amountOut,
                            deadline,
                            path,
                        });
                    
                    break;
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

export const useSwapFrom = () => {
    const swapFrom = useSelector(getSwapFrom);
    const publicKey = useSelector(getPublicKey);
    const { data: { balance = 0 } = { balance: 0 }} = useGetTokenBalance({
        type: swapFrom.type,
        publicKey, 
        contractHash: swapFrom.contractHash,
        decimals: swapFrom.decimals,
    });
    const { data: {price = 0 } = { price: 0} } = useGetCoinMarketData(swapFrom.coingeckoId);
    const amountUsd = Big(swapFrom.value || 0).times(price).round(8).toNumber();

    return {
        ...swapFrom,
        balance,
        amountUsd
    }
}

export const useSwapTo = () => {
    const swapTo = useSelector(getSwapTo);
    const publicKey = useSelector(getPublicKey);
    const { data: { balance = 0 } = { balance: 0 }}
        = useGetTokenBalance({
            type: swapTo.type,
            publicKey,
            contractHash: swapTo.contractHash,
            decimals: swapTo.decimals,
        });
    const { data: {price = 0 } = { price: 0} } = useGetCoinMarketData(swapTo.coingeckoId);
    const amountUsd = Big(swapTo.value || 0).times(price).round(8).toNumber();
    
    return {
        ...swapTo,
        balance,
        amountUsd
    }
}

// eslint-disable-next-line complexity
export const useValidateSwap = () => {
    const swapFrom = useSwapFrom();
    const swapTo = useSwapTo();
    const { isLoading, data: pairData } = useGetCurrentPair();

    if (isLoading) {
        return {
            isValid: false,
            error: 'Loading...',
        };
    }

    if (!pairData) {
        return {
            isValid: false,
            error: 'Cannot get pair data',
        };
    }

    if (!swapFrom.contractHash || !swapTo.contractHash) {
        return {
            isValid: false,
            error: 'Please select token',
        };
    }

    if (swapFrom.contractHash === swapTo.contractHash) {
        return {
            isValid: false,
            error: 'Tokens must be different',
        };
    }

    if (swapFrom.value <= 0) {
        return {
            isValid: false,
            error: 'Please enter amount',
        };
    }

    if (swapFrom.value > swapFrom.balance) {
        return {
            isValid: false,
            error: 'Insufficient balance',
        };
    }

    if ((swapFrom.value <= 0 && swapTo.value > 0) || (swapFrom.value > 0 && swapTo.value === 0)) {
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

export const useGetSwapInformations = () => {
    const [swapSettings] = useSwapSettings();
    const swapFrom = useSwapFrom();
    const swapTo = useSwapTo();
    const { data: pairData, isLoading } = useGetCurrentPair();
    const amountOutMin = useCalculateAmountOutMin();
    const isReceiveExact = useSelector(getIsReceiveExact);

    const { fee, priceImpact, rate } = useMemo(() => {
      return getSwapInfo(swapFrom, swapTo, pairData);
    }, [swapFrom, swapTo, pairData]);

    if (!pairData || isLoading) {
      return [];
    }
    
    return [
        {
            id: 'rate',
            title: 'Rate',
            value: `1 ${swapFrom.symbol} ~ ${Big(rate || 0).toFixed(8)} ${swapTo.symbol}`,
        },
        {
            id: 'fee',
            title: 'Fee',
            value: `${fee} ${swapFrom.symbol}`,
        },
        {
            id: 'priceImpact',
            title: 'Price Impact',
            value: `${Math.min(Math.abs(priceImpact), 99.7)} %`,
        },
        {
            id: 'maxMin',
            title: isReceiveExact ? 'Maximum Sent': 'Minimum',
            value: isReceiveExact ? `${Big(swapFrom.value || 0).toFixed(8, 0)} ${swapFrom.symbol}`: `At least ${Big(amountOutMin).toFixed(8, 0)} ${swapTo.symbol}`,
        },
        {
            id: 'slippage',
            title: 'Slippage',
            value: `${swapSettings.slippage}%`,
        }
    ]
}