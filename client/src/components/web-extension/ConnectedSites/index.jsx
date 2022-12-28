import React, { useState, useEffect } from 'react';
import { disconnectFromSite, getConnectedSites } from '@cd/components/hooks/useServiceWorker';
import _isEmpty from 'lodash-es/isEmpty';
import _get from 'lodash-es/get';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText/index';
import UserIcon from '@cd/assets/image/user-icon.svg';
import DisconnectIcon from '@cd/assets/image/disconnect-icon.svg';

import './index.scss';

const ConnectedSites = () => {
    const [currentPublicKeys, setPublicKeys] = useState([]);
    const [currentSite, setCurrentSite] = useState('');

    useEffect(() => {
        const getPublicKeys = async () => {
            const sites = await getConnectedSites();
            if (_isEmpty(sites)) {
                return;
            }
            const tabs = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true
            });
            if (_isEmpty(tabs)) {
                return;
            }
            const [currentTab] = tabs;
            const currentTabUrl = _get(currentTab, 'url', false);
            if (!currentTabUrl) {
                return;
            }
            const url = new URL(currentTabUrl);

            const publicKeys = Object.keys(sites).reduce((publicKeys, publicKey) => {
                const foundSite = _get(sites, publicKey, []).find(site => site === url.origin);
                if (!foundSite) {
                    return publicKeys;
                }

                return [
                    ...publicKeys,
                    publicKey
                ]
            }, []);

            setCurrentSite(url.origin);
            setPublicKeys(publicKeys);
        }

        getPublicKeys();
    }, []);

    const handleOnDisconnect = async (publicKey) => {
        await disconnectFromSite(currentSite, publicKey);

        setPublicKeys((prevPublicKeys) => prevPublicKeys.filter(key => key !== publicKey));
    }

    return (
        <div className="cd_we_connected_sites">
            <div className="title">
                <span>{currentSite}</span>
            </div>
            <div className="description">
                You have {currentPublicKeys.length} account connected to this site.
            </div>
            <div className="public_keys">
                {currentPublicKeys.map((publicKey) => {
                    return (
                        <div className="public_key_item" key={publicKey}>
                            <div className="user_icon">
                                <UserIcon/>
                            </div>
                            <div className="text">
                                <MiddleTruncatedText end={4}>{publicKey}</MiddleTruncatedText>
                            </div>
                            <div className="disconnect_icon" onClick={() => handleOnDisconnect(publicKey)}>
                                <DisconnectIcon />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}


export default ConnectedSites;