import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import CopyButton from '@cd/components/web-extension/Common/CopyButton';
import { getKeyphrase } from '@cd/components/hooks/useServiceWorker';

import './RecoveryPhrase.scss'

const RecoveryPhrase = () => {
    const [keyphrase, setKeyphrase] = useState(false); 

    const getKeyphraseFromSW = useCallback(async() => {
        const keypharse = await getKeyphrase();
        setKeyphrase(keypharse);
    }, []);

    useEffect(() => {
        getKeyphraseFromSW();
    }, [getKeyphraseFromSW]);
    
    const words = keyphrase ? keyphrase.split(' ') : [];

	return (
        <div className="cd_we_recovery-keyphrase">
            <div className="cd_we_recovery-keyphrase__wrapper">
                <ul className="cd_we_recovery-keyphrase__column">
                    {words?.map((word, index) => (
                        <li className="cd_we_recovery-keyphrase__word" key={`left-${index}`}>
                            <span className="counter">{index + 1}</span>
                            <span className="value">
                                {word}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="cd_we_recovery-keyphrase__footer">
                    <CopyButton className="cd_we_recovery-keyphrase__copy-btn" text={keyphrase} />
                </div>
            </div>
        </div>
	);
};

RecoveryPhrase.propTypes = {
	keyphrase: PropTypes.string,
}

export default RecoveryPhrase;
