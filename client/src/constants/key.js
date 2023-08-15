import APP_CONFIGS from '../config';

export const PAYMENT_AMOUNT = 100000000000;
export const MOTE_RATE = 1000000000;
export const CSPR_TRANSFER_FEE = 0.1;
export const CSPR_AUCTION_DELEGATE_FEE = 2.5;
export const CSPR_AUCTION_UNDELEGATE_FEE = 0.00001;
export const TOKEN_TRANSFER_FEE = 1;
export const REFRESH_TIME = 3 * 60 * 1000;
export const MIN_CSPR_TRANSFER = 2.5;
export const MIN_CSPR_DELEGATE_TO_NEW_VALIDATOR = 500;
export const MAX_DELEGATOR_PER_VALIDATOR = 952;
export const KEY_PREFIX = ['account-hash-', 'uref-', 'hash-'];
export const NETWORK_NAME = APP_CONFIGS.NETWORK_NAME || 'casper-test';
export const BASE_API_URL = 'http://localhost:3001';
export const DEPLOY_TTL_MS = 1800000;
export const ENTRY_POINT_DELEGATE = 'delegate';
export const ENTRY_POINT_UNDELEGATE = 'undelegate';

export const ENTRY_POINT_REDELEGATE = 'redelegate';

export const EXPLORER_URL = NETWORK_NAME === 'casper' ? 'https://cspr.live' : 'https://testnet.cspr.live';
export const CASPER_SYMBOL = 'CSPR';
export const NFT_GATEWAY = 'ipfs.dweb.link';
export const CASPER_KEY_PATH = `m/44'/506'/0'/0/`;
export const NUMBER_OF_RECOVERY_WORDS = [12, 24];
// default lock time is 5 mins
export const DEFAULT_AUTO_LOCK_TIME = 5;
export const STAKING_STATUS = {
	pending: 'pending',
	undelegating: 'undelegating',
};
