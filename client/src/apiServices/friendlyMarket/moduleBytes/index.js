import axios from 'axios';
import APP_CONFIGS from '@cd/config';

export const getSwapModuleBytes = async () => {
    const { data } = await axios.get(APP_CONFIGS.SWAP_FM_MODULE_BYTES_API);

    return data;
}

export const getLiquidityModuleBytes = async () => {
    const { data } = await axios.get(APP_CONFIGS.LIQUIDITY_FM_MODULE_BYTES_API);

    return data;
}