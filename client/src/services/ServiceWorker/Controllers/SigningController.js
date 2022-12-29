import EventEmitter from 'events';
import {
    DeployUtil,
    encodeBase16,
    formatMessageWithHeaders,
} from 'casper-js-sdk';
import _pick from 'lodash-es/pick';
import { getDeployArgs, getDeployPayment, getDeployType } from '../utils';

const SIGNING_STATUS = {
    unsigned : 'Unsigned',
    signed : 'Signed',
    failed : 'Failed'
}


class SigningController extends EventEmitter{
    unsignedDeploy = {};
    unsignedMessage = {};
    popupController;
    accountController;

    constructor(popupController, accountController) {
        super()
        this.popupController = popupController;
        this.accountController = accountController;
    }

    getActivePublicKey = async ({ origin }) => {
        const isConnected = await this.popupController.isConnected({ origin });
        if (!isConnected) {
            throw new Error('This site is not connected');
        } 

        return this.accountController.getCurrentPublicKey();
    }

    signDeploy = async (
        deployJson,
        signingPublicKeyHex,
        targetPublicKeyHex,
        origin,
    ) => {
        // const isConnected = await this.popupController.isConnected({ origin });
        // if (!isConnected) {
        //     throw new Error('This site is not connected');
        // }

        let innerDeploy = DeployUtil.deployFromJson(deployJson.deploy);
        if (!innerDeploy.ok) {
            innerDeploy.mapErr(err => {
                throw new Error(err.message);
            });
        }

        this.unsignedDeploy = {
            status: SIGNING_STATUS.unsigned,
            deploy: innerDeploy.unwrap(),
            deployJSON: deployJson.deploy,
            signingKey: signingPublicKeyHex,
            targetKey: targetPublicKeyHex
        };

        await this.popupController.openSignRequest({ origin });

        return new Promise((resolve, reject) => {
            this.once(`casperdash:signDeploy:${encodeBase16(this.unsignedDeploy.deploy.hash)}`, async () => {
                switch(this.unsignedDeploy.status) {
                    case SIGNING_STATUS.signed: {
                        const result = await this.accountController.signPrivateKeyProcess({
                            deployJSON: this.unsignedDeploy.deployJSON
                        })
                        this.unsignedDeploy = {};
        
                        return resolve(result);
                    }
                    case SIGNING_STATUS.failed: {
                        const message = this.unsignedDeploy.error || 'User Cancelled Signing';
                        return reject(
                            new Error(
                                message
                            )
                        );
                    }
                    default: 
                        reject(new Error(`Unknown error occurred`));
                }
            });
        });
    }

    parseDeployData = async () => {
        const { deploy, targetKey, signingKey } = this.unsignedDeploy;
        const type = getDeployType(deploy);
        const deployPayment = getDeployPayment(deploy);
        const deployArgs = getDeployArgs(deploy, targetKey);
        const deployAccount = deploy.header.account.toHex();

        return {
            deployHash: encodeBase16(this.unsignedDeploy.deploy.hash),
            signingKey: signingKey,
            account: deployAccount,
            bodyHash: encodeBase16(deploy.header.bodyHash),
            chainName: deploy.header.chainName,
            timestamp: new Date(deploy.header.timestamp).toLocaleString(),
            gasPrice: deploy.header.gasPrice.toString(),
            payment: deployPayment,
            deployType: type,
            deployArgs: deployArgs
          };
    }

    approveSignDeployRequest = async () => {
        await this.accountController.signPrivateKeyProcess({
            deployJSON: this.unsignedDeploy.deployJSON
        })

        this.unsignedDeploy.status = SIGNING_STATUS.signed;

        await this.popupController.closePopup();

        this.emitSignDeployEvent();
    }

    rejectSignDeployRequest = async () => {
        this.unsignedDeploy.status = SIGNING_STATUS.failed;
        this.unsignedDeploy.error = 'User Cancelled Signing';

        await this.popupController.closePopup();

        this.emitSignDeployEvent();
    }

    signMessage = async ({ message, signingPublicKey, origin }) => {
        // const isConnected = await this.popupController.isConnected({ origin });
        // if (!isConnected) {
        //     throw new Error('This site is not connected');
        // }

        let messageBytes;
        try {
          messageBytes = formatMessageWithHeaders(message);
        } catch (err) {
          throw new Error('Could not format message: ' + err);
        }

        this.unsignedMessage = {
            messageBytes,
            messageString: message,
            signingKey: signingPublicKey,
            status: SIGNING_STATUS.unsigned
        }

        await this.popupController.openSignMessageRequest({ origin });

        return new Promise((resolve, reject) => {
            this.once('casperdash:signMessage', async () => {
                switch(this.unsignedMessage.status) {
                    case SIGNING_STATUS.signed: {
                        const result = await this.accountController.signMessagePrivateKeyProcess({
                            messageBytes: this.unsignedMessage.messageBytes
                        })
                        this.unsignedMessage = {};
            
                        return resolve(encodeBase16(result));  
                    }
                    case SIGNING_STATUS.failed: {
                        const message = this.unsignedDeploy.error || 'User Cancelled Signing';
                        return reject(
                            new Error(
                                message
                            )
                        );
                    }
                    default:
                        reject(new Error('Can not sign message'));
                }
            });
        });
    }

    parseMessageData = () => {
        return {
            ..._pick(this.unsignedMessage, ['messageString', 'signingKey']),
        }
    }

    approveSignMessageRequest = async () => {
        this.unsignedMessage.status = SIGNING_STATUS.signed;
        await this.popupController.closePopup();

        this.emit('casperdash:signMessage');
    }

    rejectSignMessageRequest = async () => {
        this.unsignedMessage.status = SIGNING_STATUS.failed;
        this.unsignedMessage.error = 'User Cancelled Signing';

        await this.popupController.closePopup();

        this.emitSignMessageEvent();
    }

    emitSignDeployEvent = () => {
        this.emit(`casperdash:signDeploy:${encodeBase16(this.unsignedDeploy.deploy.hash)}`);
    }

    emitSignMessageEvent = () => {
        this.emit('casperdash:signMessage');
    }

}

export default SigningController;
