import APP_CONFIGS from '../config';

export const PAYMENT_AMOUNT = 100000000000;
export const MOTE_RATE = 1000000000;
export const CSPR_TRANSFER_FEE = 0.1;
export const TOKEN_TRANSFER_FEE = 1;
export const REFRESH_TIME = 1 * 60 * 1000;
export const MIN_TRANSFER = 2.5;
export const KEY_PREFIX = ['account-hash-', 'uref-'];
export const NETWORK_NAME = APP_CONFIGS.NETWORK_NAME;
export const BASE_API_URL = 'http://localhost:3001';
export const DEPLOY_TTL_MS = 1800000;
export const EXPLORER_URL = NETWORK_NAME === 'casper' ? 'https://cspr.live' : 'https://testnet.cspr.live';
