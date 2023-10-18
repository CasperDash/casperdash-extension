class CasperDashPluginHelper {
    postMessage(msg) {
        return new Promise((resolve, reject) => {
            const params = msg && msg.params ? msg.params : {};
            window.postMessage(
            { type: 'casperdash-extension', source: 'injectpage', destination: 'serviceWorker', payload: {
                ...msg,
                params: {
                    ...params,
                    origin: window.location.origin
                }
            } },
            window.location.origin
            );
    
            let transact = (e) => {
                if (
                    e.type === 'message'
                    && e.data.type === 'reply'
                ) {
                    window.removeEventListener('message', transact, false);
                    if (e.data.value.error) {
                        reject(new Error(e.data.value.error));

                        return;
                    }
                    resolve(e.data.value.payload);
                }
            };
    
            window.addEventListener('message', transact, false);
        });
    }

    isConnected() {
        return this.postMessage({
            methodName: 'popupManager.isConnected',
        });
    }

    async sign(
        deploy,
        signingPublicKeyHex,
        targetPublicKeyHex
      ) {
        return this.postMessage({
            methodName: 'signingManager.signDeploy',
            params: {
                deploy,
                signingPublicKeyHex,
                targetPublicKeyHex
            }
        });
      }

    getActivePublicKey() {
        return this.postMessage({
            methodName: 'signingManager.getCurrentPublicKey',
        });
    }

    requestConnection() {
        return this.postMessage({ 
            methodName: 'popupManager.openRequestConnect',
        });
    }

    requestSwitchAccount() {
        return this.postMessage({
            methodName: 'popupManager.requestSwitchAccount',
        });
    }

    disconnectFromSite() {
        return this.postMessage({ 
            methodName: 'popupManager.disconnectFromSite',
        });
    }

    signMessage(message, signingPublicKey) {
        return this.postMessage({ 
            methodName: 'signingManager.signMessage',
            params: {
                message,
                signingPublicKey
            }
        });
    }
}

window.casperDashHelper = new CasperDashPluginHelper();