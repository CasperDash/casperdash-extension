import React, { useState, useEffect, useRef } from 'react';
import browser from 'webextension-polyfill';
import { disconnectFromSite, getConnectedSites } from '@cd/components/hooks/useServiceWorker';
import _isEmpty from 'lodash-es/isEmpty';
import _get from 'lodash-es/get';
import ConfirmModal from '@cd/components/Common/ConfirmModal';
import { MiddleTruncatedText } from '@cd/components/Common/MiddleTruncatedText';
import { withServiceWorkerRequired } from '@cd/components/hocs/ServiceWorkerRequired';
import UserIcon from '@cd/assets/image/user-icon.svg';
import DisconnectIcon from '@cd/assets/image/disconnect-icon.svg';
import './index.scss';

const ConnectedSites = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentPublicKeys, setPublicKeys] = useState([]);
    const [currentSite, setCurrentSite] = useState('');
    const publicKeyRef = useRef(null);

    const handleOnOpenModal = (publicKey) => {
        publicKeyRef.current = publicKey;
        setIsOpenModal(true);
    };

    const handleOnCloseModal = () => {
        setIsOpenModal(false);
    }

    const handleOnConfirm = async () => {
        const publicKey = publicKeyRef.current;
        await disconnectFromSite(currentSite, publicKey);

        setPublicKeys((prevPublicKeys) => prevPublicKeys.filter(key => key !== publicKey));

        setIsOpenModal(false);
    }

    useEffect(() => {
        const getPublicKeys = async () => {
            const sites = await getConnectedSites();
            if (_isEmpty(sites)) {
                return;
            }
            const tabs = await browser.tabs.query({
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

            const publicKeys = Object.keys(sites).filter(publicKey => {
                return _get(sites, publicKey, []).includes(url.origin);
            });

            setCurrentSite(url.origin);
            setPublicKeys(publicKeys);
        }

        getPublicKeys();
    }, []);

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
                            <div className="disconnect_icon" onClick={() => handleOnOpenModal(publicKey)}>
                                <DisconnectIcon />
                            </div>
                        </div>
                    )
                })}
            </div>
            <ConfirmModal
	isOpen={isOpenModal}
	onConfirm={handleOnConfirm}
	onClose={handleOnCloseModal}
	title="Disconnect your site"
	description={
                    <div className="cd_setting_modal">
                        Are you sure to disconnect your site?
                    </div>
                }
            />
        </div>
    );
}


export default withServiceWorkerRequired(ConnectedSites);