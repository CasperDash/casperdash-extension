import { useCallback, useEffect, useRef, useState } from 'react';

const useTimeout = (cb, delay) => {
    const saveCb = useRef();
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        saveCb.current = cb;
    }, [cb]);

    useEffect(() => {
        if (timeoutId !== 'start') {
            return undefined;
        }

        const id = setTimeout(() => {
             saveCb.current();
        }, delay);

        setTimeoutId(id);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [delay, timeoutId]);

    const startTimeout = useCallback(() => {
        clearTimeout(timeoutId);
        setTimeoutId('start');
    }, [timeoutId]);

    return startTimeout;
}

export default useTimeout;