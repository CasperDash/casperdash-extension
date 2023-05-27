import axios from 'axios';
import APP_CONFIGS from '@cd/config';

export const getListTokens = async () => {
    const { data } = await axios.get(APP_CONFIGS.SWAP_FM_TOKEN_API);

    return data.tokens;
}