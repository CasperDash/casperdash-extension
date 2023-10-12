import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getNetwork } from '@cd/selectors/settings';
import { getConfigKey } from '@cd/services/configurationServices';

export const useConfiguration = () => {
    const network = useSelector(getNetwork);

    const getConfig = useCallback((key) => {
        return getConfigKey(key, network);
    }, [network]);

    return {
        getConfig
    }
}